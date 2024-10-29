import React from 'react';
import { List, ListItem, Card, CardContent, Typography } from '@mui/material';

 

interface HistoryListProps {
    history: HistoryEntry[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
    return (
        <List>
            {history.map((entry, index) => (
                <ListItem key={index}>
                    <Card variant="outlined" style={{ width: '300px', margin: '5px auto' }}>
                        <CardContent>
                            <Typography variant="body1">值: {entry.value}</Typography>
                            <Typography variant="body2" color="textSecondary">时间: {entry.timestamp}</Typography>
                        </CardContent>
                    </Card>
                </ListItem>
            ))}
        </List>
    );
};

export default HistoryList;
