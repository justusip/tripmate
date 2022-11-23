import * as React from "react";
import {useState} from "react";
import moment from "moment";
import {AppBar, Button, IconButton, ListItemAvatar, ListItemButton, Toolbar} from "@mui/material";
import Footer from "../components/Footer";
import {Create, Delete, Description, Done, Edit} from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import {Plan} from "../types/Plan";
import update from 'immutability-helper';
import {useLocalStorage} from "react-use";
import PlanCreate from "../components/PlanCreate";
import Empty from "../components/generic/Empty";
import PlanEdit from "../components/PlanEdit";
import {useSnackbar} from "notistack";

export default function Plans() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [delMode, setDelMode] = useState(false);

    /*
    {
        name: "Christmas Japan Trip",
        start: moment("2022-12-22"),
        end: moment("2022-12-26"),
        city: "Osaka",
        events: [
            {
                name: "Osaka Castle",
                from: moment("2022-12-22 15:30:00"),
                to: moment("2022-12-22 18:30:00"),
                notes: ""
            }
        ]
    }
    */
    const [plans, setPlans] = useLocalStorage<Plan[]>("plans", [],
        {
            raw: false,
            serializer: JSON.stringify,
            deserializer: o => JSON.parse(o, (key, value) => {
                const m = moment.utc(value, moment.ISO_8601);
                if (m.isValid())
                    return m;
                return value;
            })
        }
    );

    const [planCreateOpen, setPlanCreateOpen] = useState(false);
    const [planEditOpen, setPlanEditOpen] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(0);
    const editPlan = (planId: number) => {
        setEditingPlanId(planId);
        setPlanEditOpen(true);
    };

    return <div className={"w-screen h-screen relative flex flex-col bg-neutral-900"}>
        <PlanCreate open={planCreateOpen}
                    setOpen={setPlanCreateOpen}
                    onCreate={(plan: Plan) => {
                        const p = [...plans!, plan];
                        setPlans(p);
                        editPlan(p.length - 1);
                    }}/>
        <PlanEdit open={planEditOpen}
                  setOpen={setPlanEditOpen}
                  plan={plans![editingPlanId]}
                  setPlan={(plan: Plan) => {
                      setPlans(update(plans, {[editingPlanId]: {$set: plan}}));
                  }}
        />
        <AppBar position="static">
            <Toolbar className={"pr-2"}>
                <div className={"text-xl font-bold flex-1"}>
                    Trip Planner
                </div>
                <IconButton size={"large"} onClick={() => setDelMode(!delMode)}>
                    {
                        !delMode ? <Delete/> : <Done/>
                    }
                </IconButton>
            </Toolbar>
        </AppBar>
        <div className={"flex-1 overflow-scroll"}>
            {
                plans?.length === 0 && <Empty desc={"Create itinerary using the button below."}/>
            }
            {
                <List disablePadding>
                    {
                        plans!.map((o, i) =>
                            <ListItem key={i}
                                      disablePadding
                                      secondaryAction={<IconButton>{!delMode ? <Edit/> : <Delete/>}</IconButton>}
                                      onClick={() => {
                                          if (!delMode) {
                                              editPlan(i);
                                          } else {
                                              const p = update(plans, {$splice: [[i, 1]]});
                                              setPlans(p);
                                              if (p?.length === 0)
                                                  setDelMode(false);
                                          }
                                      }}>
                                <ListItemButton onClick={() => editPlan(i)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Description/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={o.name}
                                                  secondary={`${o.city.name}, ${o.start.format("DD/MM")} - ${o.end.format("DD/MM")} (${moment.duration(o.end.diff(o.start)).asDays() + 1} days)`}/>
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                </List>
            }
        </div>
        <Button variant={"outlined"}
                startIcon={<Create/>}
                className={"m-4"}
                onClick={() => setPlanCreateOpen(true)}>
            Create New Itinerary
        </Button>
        <Footer/>
    </div>;
}
