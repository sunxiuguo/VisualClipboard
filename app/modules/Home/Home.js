import React, { useEffect } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import useStyles from './config/UseStyles';
import DataBase from '../../utils/IndexedDB';
import ClipBoard from '../../utils/Clipboard';
import DateFormat from '../../utils/Utils';

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

    const clearStore = _type => {
        Db.delete(_type);
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

    const renderTextList = () =>
        contents.map(item => (
            <ExpansionPanel
                key={item.id}
                TransitionProps={{ unmountOnExit: true }}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.expansionHeader}>
                        {DateFormat(item.createTime)}
                    </Typography>
                    <Typography className={classes.expansionSecondaryHeader}>
                        {item.content}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Typography>{item.content}</Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        ));

    const renderImageList = () => (
        <div className={classes.imgRoot}>
            <GridList
                cellHeight="auto"
                className={classes.imgGridList}
                cols={4}
            >
                {contents.map(item => (
                    <GridListTile key={Math.random()} cols={2}>
                        <img src={item.content} alt="哈哈哈哈" />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );

    const renderHtmlList = () => {};

    const renderContentList = () => {
        switch (type) {
            case 'text':
                return renderTextList();
            case 'image':
                return renderImageList();
            case 'html':
                return renderHtmlList();
            default:
                return '未识别的类型';
        }
    };

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
                <Container maxWidth="lg" className={classes.container}>
                    {renderContentList()}
                    <Button onClick={() => clearStore('text')}>
                        清除text记录
                    </Button>
                </Container>

                <MadeWithLove />
            </main>
        </div>
    );
}
