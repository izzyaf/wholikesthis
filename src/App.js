import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import PersonPinOutlinedIcon from '@material-ui/icons/PersonPinOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgress from "@material-ui/core/LinearProgress";

import findFans from "./findFans";
import getPageID from "./getPageID";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/leminhph/wholikesthis">
                leminhph
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const handleSubmit = (url, persona, setProcessing, setData) => async e => {
    e.preventDefault();

    setProcessing(true);

    const pageId = await getPageID(url)
    const fans = await findFans(pageId, persona).finally(() => {
        setProcessing(false)
    });

    console.log(fans)
}

export default () => {
    const [formError, setFormError] = React.useState({})
    const [url, setUrl] = React.useState('')
    const [persona, setPersona] = React.useState('')
    const [processing, setProcessing] = React.useState(false)
    const [data, setData] = React.useState([]);

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <PersonPinOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Find my fans
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit(url, persona, setProcessing, setData)}>
                    <TextField
                        id="url"
                        name="url"
                        label="Page URL"
                        error={Boolean(formError['url'])}
                        helperText={formError['url']}
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        required
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        autoComplete="url"
                        autoFocus
                    />
                    <TextField
                        id="persona"
                        name="persona"
                        label="Token & Cookies"
                        error={Boolean(formError['persona'])}
                        helperText={formError['persona']}
                        value={persona}
                        onChange={e => setPersona(e.target.value)}
                        required
                        fullWidth
                        multiline
                        rows="10"
                        rowsMax="10"
                        variant="outlined"
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Find them!
                    </Button>
                    {processing && <LinearProgress/>}
                    {/*<Grid container>*/}
                    {/*    <Grid item xs>*/}
                    {/*        <Link href="#" variant="body2">*/}
                    {/*            Forgot password?*/}
                    {/*        </Link>*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item>*/}
                    {/*        <Link href="#" variant="body2">*/}
                    {/*            {"Don't have an account? Sign Up"}*/}
                    {/*        </Link>*/}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
