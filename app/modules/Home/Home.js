import React, { useEffect } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import useStyles from './config/UseStyles';
import DataBase from '../../utils/IndexedDB';
import ClipBoard from '../../utils/Clipboard';

const clipBoard = new ClipBoard();
clipBoard.startWatching();

function MadeWithLove() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Built with love by the '}
            <Link color="inherit" href="https://material-ui.com/">
                sunxiuguo1@qq.com
            </Link>
        </Typography>
    );
}

const LIST_ITEMS = [
    {
        id: 1,
        type: 'text',
        label: '文本',
        icon: <DashboardIcon />
    },
    {
        id: 2,
        type: 'image',
        label: '图像',
        icon: <ShoppingCartIcon />
    },
    {
        id: 3,
        type: 'html',
        label: 'HTML',
        icon: <PeopleIcon />
    }
];

export default function Dashboard() {
    const Db = new DataBase();
    const classes = useStyles();
    const [type, setType] = React.useState('text');
    const [open, setOpen] = React.useState(true);
    const [contents, setContent] = React.useState([]);

    useEffect(() => {
        let getContent = async () => {
            const contentArray = await Db.get(type);
            setContent(contentArray);
        };
        getContent();
        return () => {
            getContent = null;
        };
    });

    const handleDrawerClose = () => {
        setOpen(!open);
    };

    const handleClickItem = _type => {
        setType(_type);
    };

    const renderArrowIcon = () =>
        open ? <ChevronLeftIcon /> : <ChevronRightIcon />;

    const renderListMenuItems = () =>
        LIST_ITEMS.map(item => (
            <ListItem
                button
                onClick={() => handleClickItem(item.type)}
                key={item.id}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
            </ListItem>
        ));

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        !open && classes.drawerPaperClose
                    )
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        {renderArrowIcon()}
                    </IconButton>
                </div>
                <Divider />
                <List>{renderListMenuItems()}</List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <List>
                        {contents.map(item => (
                            <ListItem key={item.createTime}>
                                {item.content}
                            </ListItem>
                        ))}
                    </List>
                </Container>

                <MadeWithLove />
            </main>
        </div>
    );
}
