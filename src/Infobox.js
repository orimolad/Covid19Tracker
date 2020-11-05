import React from 'react';
import "./Infobox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function Infobox({ title, cases, active, isRed, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infobox ${active && 'infobox--selected'} ${
            isRed && "infobox--red"
        }`}
        >
            <CardContent>
                <Typography className="infobox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={` ${!isRed && "infobox__cases--green"}`}>{cases}</h2>
                <Typography className="infobox__total" color="textSecondary">
                    {total} Total
                    </Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox
