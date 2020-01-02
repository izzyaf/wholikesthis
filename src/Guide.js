import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import React from "react";

export const Guide = (props) => {
    return <Dialog
        maxWidth={"sm"}
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="guide-dialog-title"
    >
        <DialogContent>
            <Typography variant="body1">
                1. Install Facebook Token Extractor:
                https://chrome.google.com/webstore/detail/facebook-token-extractor/ffhpckociplclgaknmfnbdeojdhoolnj
                2. Login to Facebook.com using account having permission to view fan list.
                3. Click on Facebook Token Extractor extension icon, and click "Extract". Copy & paste
                the text into "Token & Cookies" field.
                4. Paste link of the page you want to retrieve fan list into "Page URL"
                5. Click "Find them!"
            </Typography>
        </DialogContent>
    </Dialog>;
}
