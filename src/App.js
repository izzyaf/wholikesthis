import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import PersonPinOutlinedIcon from '@material-ui/icons/PersonPinOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from "@material-ui/core/LinearProgress";

import {getPageFans, getPageID} from "./fn";
import {useStyles} from "./styles";
import {Copyright} from "./Copyright";
import {Guide} from "./Guide";
import {stringifyUser, writeToFile} from "./lib";

const handleSubmit = (url, stringifiedPersona, setProcessing, setFanCount) => async e => {
    e.preventDefault();

    const save = writeToFile('fans.csv')
    const persona = JSON.parse(stringifiedPersona)

    setProcessing(true);

    const pageId = await getPageID(url)

    let offset = 0
    let limit = 1000
    let exhausted = false
    let currentFanCount = 0

    while (!exhausted) {
        try {
            const fans = await getPageFans(pageId, limit, offset, persona.token, persona.cookie)

            if (fans) {
                const firstChunk = offset === 0

                const receivedFanCount = Object.values(fans).reduce((totalLength, group) => {
                    return totalLength + group.length
                }, 0)
                if (receivedFanCount === 0) {
                    exhausted = true
                }
                currentFanCount += receivedFanCount
                setFanCount(currentFanCount)

                let content = Object.entries(fans).reduce((rows, [type, users]) => {
                    const row = users.map(user => stringifyUser(type, user)).join('\n')

                    return rows + row + '\n'
                }, '') + '\n'

                if (content) {
                    if (firstChunk) {
                        content = "\uFEFF" + content // BOM
                    }
                }

                await save(content, exhausted)

                offset += limit
            }
        } catch (e) {
            console.error(e)
            break
        }
    }

    setProcessing(false)
}

export default () => {
    const [formError] = React.useState({})
    const [url, setUrl] = React.useState('')
    const [persona, setPersona] = React.useState('')
    const [fanCount, setFanCount] = React.useState(null)
    const [processing, setProcessing] = React.useState(false)
    const [showGuide, setShowGuide] = React.useState(false)

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
                <Button className={classes.showGuideButton} variant="outlined" color="primary"
                        onClick={() => setShowGuide(true)}>
                    How to use?
                </Button>
                <Guide open={showGuide} onClose={() => setShowGuide(false)}/>
                <form className={classes.form} noValidate
                      onSubmit={e => {
                          setFanCount(null)
                          handleSubmit(url, persona, setProcessing, setFanCount)(e)
                      }}>
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
                        disabled={processing}
                    >
                        Find them!
                    </Button>
                    {processing && <LinearProgress/>}
                    {fanCount !== null && <Typography className={classes.fanCount} align="center" component="div">
                        Found <Box display="inline" fontWeight="fontWeightBold">{fanCount}</Box> fans
                    </Typography>}
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}
