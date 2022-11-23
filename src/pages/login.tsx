import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {AirplanemodeActiveOutlined, Edit} from "@mui/icons-material";
import Link from "next/link";

export default function Login() {
    return <Container component="main" maxWidth="xs" className={""}>
        <CssBaseline/>
        <video autoPlay muted loop className={"absolute inset-0 opacity-50"}>
            <source src="/3198087859.mp4" type="video/mp4"/>
        </video>
        <div className={"h-screen flex flex-col place-items-center place-content-center"}>
            <Avatar sx={{m: 1, bgcolor: "primary.main"}}>
                <AirplanemodeActiveOutlined/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Prepare Your Next Adventure
            </Typography>
            <Link href={"/questions"} passHref>
                <Button className={"mt-16 w-full"} variant="outlined" startIcon={<Edit/>}>Suggest
                    Itinerary</Button>
            </Link>
        </div>
    </Container>;
}
