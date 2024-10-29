import os
import json
import requests
import logging
from urllib.parse import urljoin
import semver
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# 定义存储目录和 package.json 文件路径
storage_dir = r"C:\dev\docker-compose\verdaccio\storage"
package_json_file = "package.json"
npm_registry_url = "https://registry.npmjs.org/"
cache_dir = r"C:\dev\pnpm-cache\metadata"

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

# 缓存相关设置
CACHE_EXPIRY = 86400  # 缓存时间：1 天

# 统计信息
total_dependencies = 0
downloaded_count = 0
successful_downloads = 0


def download_tgz(url, output_path):
    """Download .tgz file from the given URL."""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        logging.info(f"Downloaded: {output_path}")
        return True
    except requests.HTTPError as e:
        logging.error(f"Failed to download {url}: {e}")
        return False


def get_cache_path(package_name):
    """Get the cache file path for a package."""
    # Replace slashes in scoped package names for valid filenames
    filename = package_name.replace("/", "__") + ".json"
    return os.path.join(cache_dir, filename)


def fetch_metadata(package_name):
    """Fetch package metadata from npm registry with caching."""
    cache_path = get_cache_path(package_name)
    current_time = time.time()
    try:
            
        # Check if cache exists and is valid
        if os.path.exists(cache_path):
            with open(cache_path, "r") as f:
                cached_data = json.load(f)
                if current_time - cached_data["timestamp"] < CACHE_EXPIRY:
                    # logging.info(f"Using cached metadata for [{package_name}]")
                    return cached_data["metadata"]

        # Fetch new metadata
        # logging.info(f"Fetching metadata for [{package_name}]")
        response = requests.get(urljoin(npm_registry_url, package_name))
        if response.status_code == 200:
            metadata = response.json()
            with open(cache_path, "w") as f:
                json.dump({"metadata": metadata, "timestamp": current_time}, f)
            return metadata
        else:
            logging.error(f"Failed to fetch metadata for [{package_name}]")
            return None
    except Exception as e:
        logging.error(f"Failed to fetch metadata for [{package_name}] cache_path[{cache_path}]: {e}")
        return None


def parse_version_range(package_name, version_range):
    """Parse NPM-style version range to semver compatible range."""
    # Split the version range by '||' to handle multiple ranges
    # logging.info(f"Parsing version range: {version_range}")
    ranges = version_range.split("||")
    parsed_ranges = []

    for range_expr in ranges:
        range_expr = range_expr.strip()
        if range_expr.startswith("npm:"):
            # Handle cases like npm:package@^1.2.3
            range_expr = range_expr.split("@")[1]

        if " - " in range_expr:
            # Handle range expressions like "1 - 3" or "7.0.0 - 7.2.0"
            lower, upper = range_expr.split(" - ")
            lower_version_parts = lower.strip().split(".")
            upper_version_parts = upper.strip().split(".")

            # Convert single number to valid semver range
            if len(lower_version_parts) == 1:
                lower = f"{lower_version_parts[0]}.0.0"
            if len(upper_version_parts) == 1:
                upper = f"{int(upper_version_parts[0]) + 1}.0.0"
            else:
                upper = f"{upper_version_parts[0]}.{upper_version_parts[1]}.{int(upper_version_parts[2]) + 1}"

            parsed_ranges.append((f">={lower}", f"<{upper}"))
        elif range_expr.startswith("~"):
            base_version = range_expr[1:]
            major, minor, patch = map(int, base_version.split("."))
            lower_bound = base_version
            upper_bound = f"{major}.{minor + 1}.0"
            parsed_ranges.append((f">={lower_bound}", f"<{upper_bound}"))
        elif range_expr.startswith("^"):
            base_version = range_expr[1:]
            major, minor, patch = map(int, base_version.split("."))
            if major > 0:
                upper_bound = f"{major + 1}.0.0"
            elif minor > 0:
                upper_bound = f"{major}.{minor + 1}.0"
            else:
                upper_bound = f"{major}.{minor}.{patch + 1}"
            parsed_ranges.append((f">={base_version}", f"<{upper_bound}"))
        elif range_expr.startswith("="):
            # Handle exact match, e.g., =1.0.5
            exact_version = range_expr[1:]
            parsed_ranges.append((f"=={exact_version}", None))
        else:
            # Handle cases like "1.2.3" or single number "1"
            version_parts = range_expr.split(".")
            if len(version_parts) == 1:
                # Support for single digit versions, e.g., "1" as "1.0.0"
                major = int(range_expr)
                parsed_ranges.append((f">={major}.0.0", f"<{major + 1}.0.0"))
            else:
                parsed_ranges.append((f"=={range_expr}", None))
                # logging.info(f"Package [{package_name}] version range: {range_expr}")

    return parsed_ranges


def get_recommend_stable_versions(available_versions, count=5):
    """Recommend the latest stable versions."""
    stable_versions = [
        v for v in available_versions if not semver.VersionInfo.parse(v).prerelease
    ]
    # Sort versions in descending order
    stable_versions.sort(key=semver.VersionInfo.parse, reverse=True)
    # Return the latest 'count' stable versions
    return stable_versions[:count]


def resolve_version(package_name, metadata, version_range):
    """Resolve the specific version from a version range using semver."""

    available_versions = list(metadata["versions"].keys())
    recommend_stable_versions = get_recommend_stable_versions(available_versions, 10)
    if version_range == "*":
        return metadata["dist-tags"]["latest"], recommend_stable_versions

    # if "aashutoshrathi" in package_name:
    #     print("")

    # Parse the version range into a list of semver-compatible ranges
    parsed_ranges = parse_version_range(package_name, version_range)

    # logging.info(f"Resolving version for [{package_name}] with range {version_range},parsed_ranges: {parsed_ranges}")

    try:
        # Find all versions that satisfy any of the given ranges
        valid_versions = []
        for lower_bound, upper_bound in parsed_ranges:
            for v in available_versions:
                if semver.match(v, lower_bound) and (
                    upper_bound is None or semver.match(v, upper_bound)
                ):
                    valid_versions.append(v)

        if valid_versions:
            return (
                max(valid_versions, key=semver.VersionInfo.parse),
                recommend_stable_versions,
            )  # Return the highest valid version
    except ValueError as e:
        logging.error(
            f"Version for [{package_name}] parsing error for {version_range}: {e}"
        )
        return None, recommend_stable_versions

    return None, recommend_stable_versions


def package_generator(dependencies, visited):
    """Generate packages to be processed."""
    for package_name, version in dependencies.items():
        if package_name not in visited:
            visited.add(package_name)
            clean_version = version.lstrip("^")
            yield package_name, clean_version


def process_package(package_name, version_range):
    """Process a single package and download if necessary."""
    # 检查并解析 npm 别名格式
    if version_range.startswith("npm:"):
        parts = version_range.split("@")
        if len(parts) == 2:
            package_name = parts[0][4:]  # 去除 'npm:' 前缀
            version_range = parts[1]
        else:
            logging.error(f"Invalid npm alias format: {version_range}")
            return [], False

    metadata = fetch_metadata(package_name)
    if not metadata:
        return [], False

    (version, recommend_stable_versions) = resolve_version(
        package_name, metadata, version_range
    )
    if not version:
        logging.warning(
            f"Could not resolve a version for [{package_name}] \tversion_range:{version_range}\trecommend_stable_versions: {recommend_stable_versions}"
        )
        return [], False

    # 根据包名设置存储路径
    if package_name.startswith("@"):
        scope, package = package_name.split("/")
        package_dir = os.path.join(storage_dir, scope, package)
    else:
        package = package_name
        package_dir = os.path.join(storage_dir, package)

    os.makedirs(package_dir, exist_ok=True)
    tgz_filename = f"{package}-{version}.tgz"
    tgz_filepath = os.path.join(package_dir, tgz_filename)

    download_successful = False
    if not os.path.exists(tgz_filepath):
        logging.info(f"File not found: {tgz_filepath}. Downloading...")
        dist_info = metadata["versions"][version]["dist"]
        download_url = dist_info["tarball"]
        download_successful = download_tgz(download_url, tgz_filepath)
    # else:
    #     logging.info(f"File already exists: {tgz_filepath}")

    dependencies = metadata["versions"][version].get("dependencies", {})
    return [
        (dep_name, dep_version.lstrip("^"))
        for dep_name, dep_version in dependencies.items()
    ], download_successful


def process_all_packages(all_dependencies):
    """Process all packages using a thread pool."""
    visited = set()
    global total_dependencies, downloaded_count, successful_downloads
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {}
        package_queue = list(package_generator(all_dependencies, visited))

        while package_queue or futures:
            while package_queue:
                package_name, version_range = package_queue.pop(0)
                future = executor.submit(process_package, package_name, version_range)
                futures[future] = (package_name, version_range)

            done, _ = as_completed(futures), futures.keys()
            for future in done:
                package_name, version_range = futures.pop(future)
                result, download_successful = (
                    future.result()
                )  # This will raise any exceptions caught during execution
                if result:
                    for dep_name, dep_version in result:
                        if dep_name not in visited:
                            package_queue.append((dep_name, dep_version))
                            visited.add(dep_name)
                total_dependencies += len(result)
                downloaded_count += 1
                if download_successful:
                    successful_downloads += 1
    logging.info(f"All packages processed. visited: {len(visited)}")


if __name__ == "__main__":
    # 确保缓存目录存在
    os.makedirs(cache_dir, exist_ok=True)
    # 读取和解析 package.json 文件
    with open(package_json_file, "r") as f:
        package_data = json.load(f)

    # 获取 dependencies 和 devDependencies
    dependencies = package_data.get("dependencies", {})
    dev_dependencies = package_data.get("devDependencies", {})

    # 合并依赖项
    all_dependencies = {**dependencies, **dev_dependencies}

    # 处理所有依赖项
    process_all_packages(all_dependencies)

    logging.info(f"Finished checking and downloading packages.")
    logging.info(f"Total dependencies processed: {total_dependencies}")
    logging.info(f"Total downloads attempted: {downloaded_count}")
    logging.info(f"Total successful downloads: {successful_downloads}")
