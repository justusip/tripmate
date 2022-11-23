import Frag from "./generic/Frag";
import * as React from "react";
import {useMemo, useState} from "react";
import TextField from "@mui/material/TextField";
import useFetch from "../utils/useFetch";
import {Alert, Autocomplete} from "@mui/material";
import Button from "@mui/material/Button";
import {SwapVert} from "@mui/icons-material";

export default function CurrencyExchange(props: {
    open: boolean,
    setOpen: (open: boolean) => void
}) {

    const {
        data,
        error
    } = useFetch<{ base: string, rates: { [key: string]: number } } | undefined>("https://api.exchangerate.host/latest");
    const currencies = useMemo<string[] | null>(() => {
        if (!data)
            return null;
        return Object.keys(data.rates);
    }, [data]);

    const [fromCur, setFromCur] = useState("HKD");
    const [fromAmt, setFromAmt] = useState(0);
    const [toCur, setToCur] = useState("JPY");
    const [toAmt, setToAmt] = useState(0);

    const calc = (fromAmt: number, fromCur: string, toCur: string) => {
        if (!data) return null;
        return fromAmt * (1 / data.rates[fromCur]) * data.rates[toCur];
    };

    return <Frag {...props}
                 title={"Currency Exchange Tool"}>
        <div className={"flex place-items-center gap-2"}>
            {
                data && <>
                    <div className={"w-2 h-2 rounded-full bg-green-500"}></div>
                    Latest Prices Loaded ({currencies!.length} currencies)
                </>
            }
            {
                !data && <>
                    <div className={"w-2 h-2 rounded-full bg-red-500"}></div>
                    Loading Latest Prices...
                </>
            }
        </div>
        <div className={"flex gap-2"}>
            <Autocomplete
                value={fromCur}
                onChange={(e, v) => {
                    if (!v) return;
                    if (v === toCur)
                        setToCur(fromCur);
                    setFromCur(v);
                }}
                options={currencies || []}
                className={"w-32"}
                renderInput={(params) => <TextField {...params} label="From"/>}/>
            <TextField label={"Amount"}
                       className={"flex-1"}
                       type={"number"}
                       value={fromAmt}
                       onChange={e => {
                           const n = parseFloat(e.target.value);
                           setFromAmt(n);
                           setToAmt(calc(n, fromCur, toCur)! || 0);
                       }}
                       inputProps={{inputMode: 'decimal'}}/>
        </div>
        <Button variant={"outlined"}
                size={"large"}
                startIcon={<SwapVert/>}
                onClick={() => {
                    setFromCur(toCur);
                    setToCur(fromCur);
                    setToAmt(calc(fromAmt, toCur, fromCur)!);
                }}>
            Swap Currencies
        </Button>
        <div className={"flex gap-2"}>
            <Autocomplete
                value={toCur}
                onChange={(e, v) => {
                    if (!v) return;
                    if (v === fromCur)
                        setFromCur(toCur);
                    setToCur(v);
                }}
                options={currencies || []}
                className={"w-32"}
                renderInput={(params) => <TextField {...params} label="To"/>}/>
            <TextField label={"Amount"}
                       className={"flex-1"}
                       type={"number"}
                       value={toAmt}
                       onChange={e => {
                           const n = parseFloat(e.target.value);
                           setFromAmt(calc(n, toCur, fromCur)! || 0);
                           setToAmt(n);
                       }}
                       inputProps={{inputMode: 'decimal'}}/>
        </div>
        <Alert severity={"info"} className={"flex place-items-center gap-1"}>
            <div>1 {fromCur} = {calc(1, fromCur, toCur)?.toPrecision(3)} {toCur}</div>
            <div>1 {toCur} = {calc(1, toCur, fromCur)?.toPrecision(3)} {fromCur}</div>
        </Alert>
    </Frag>;
}
