import { useEffect, useState, ViewTransition } from "react";
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";

// variables
async function getServerSide() {
    try {
        const response = await fetch("https://nyc-essential-svr-lfq4.vercel.app/api/servertime");

        if (!response.ok) {
            return {
                serverTime: "-",
                offset: 0,
            }
        } else {
            const data = await response.json();
            console.log(data.serverTime)

            return {
                serverTime: data.serverTime,
                offset: data.offset
            }
        }
    } catch {

    }
}

function formatTime(u) {
    const th = new Date(u);
    let hr = th.getHours();
    let min = String(th.getMinutes()).padStart(2, 0);
    let sec = String(th.getSeconds()).padStart(2, 0);
    let mls = String(th.getMilliseconds()).padStart(3, 0);
    let meridiem = hr >= 12 ? "PM" : "AM";

    hr = hr % 12 || 12;

    return `${hr}:${min}:${sec}.${mls} ${meridiem}`;
}

function activeLink({ isActive }) {
    return isActive ? "link-active": "link";
}

// components
function Home({ displayer = "Welcome" }) {
    return (
        <>
            <h1>{ displayer === "Welcome and Welcome" ? "Welcome and welcome!" : "Welcome!" }</h1>
            <p>Please note that this is a deploying test of Vite React app and <strong>NOT</strong> an official wandering page.</p>
            <meter low="33" high="66" min="0" max="100" value="77"></meter>
        </>
    );
}

function About() {
    return (
        <>
            <h1>About</h1>
        </>
    );
}

function Exclusive({ fontFamily, func }) {
    return (
        <>
            <h1>Exclusive</h1>
            <label
                htmlFor="fontchanger"
                style={{
                    marginRight: "10px",
                    fontFamily: fontFamily
                }}
            >
                Change Font Here
            </label>
            <input 
                name="fontchanger"
                id="fontchanger"
                value={fontFamily}
                onChange={({ target }) => {
                    func(target.value)
                }}
            />
        </>
    );
}

function Settings(props) {
    return (
        <>
            <code>Empty Config Method {"<>"}</code>
            <hr></hr>
            <p><code>Client Time: { formatTime(new Date(props.ticks[0]).getTime()) }</code></p>
            <p><code>Server Time: { formatTime(new Date(props.ticks[1]).getTime() + (props.now[0] - props.now[1])) }</code></p>
            <p style={{fontFamily: props.fontFamily}}>{`${props.now[0]} // ${props.now[1]}`}</p>
            <p>offset: {`${props.now[2]}`}</p>
        </>
    );
}

// "App" component
function App({ composition = "understand" }) {
    // useState instance
    const [click, setClick] = useState(0);
    const [fontFam, setFontFam] = useState("");
    const [getPrm, setGetPrm] = useState(0);
    const [clientTime, setClientTime] = useState(new Date());
    const [serverTime, setServerTime] = useState("-");
    const [offset, setOffset] = useState(0);
    const [tickRel, setTickRel] = useState(0);

    useEffect(() => {
        const ints = setInterval(() => {
            setGetPrm(Math.round(performance.now()));
            setClientTime(new Date());
        }, 1);

        return () => {
            clearInterval(ints);
        }
    }, []);

    // run only once
    useEffect(() => {
        setTimeout(async () => {
            console.log("Checking server time...");
            let s = await getServerSide();

            console.log(s);
    
            setServerTime(s.serverTime);
            setOffset(s.offset);
            setTickRel(Math.round(performance.now()));
        }, 1000);
    }, []);

    let fontFamilyStyle = {
        fontFamily: fontFam
    };

    return (
        <Router>
            <nav>
                <NavLink to="/" className={activeLink} viewTransition>Home</NavLink>
                <NavLink to="/about" className={activeLink} viewTransition>About</NavLink>
                <NavLink to="/exclusive" className={activeLink} viewTransition>Exclusive</NavLink>
                <NavLink to="/settings" className={activeLink} viewTransition>Settings</NavLink>

                {/* Clicker challenge */}
                <p id="click-announcer" style={fontFamilyStyle}>You've clicked <b>{click}</b> times!</p>
                <button className="clicker" onClick={() => setClick((prev) => prev + 1)}>Click here</button>

                <span className="ticker">{getPrm}</span>
            </nav>

            <hr />

            <ViewTransition name="z-frames">
                <main>
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/about" element={<About />}></Route>
                        <Route path="/exclusive" element={<Exclusive fontFamily={fontFam} func={setFontFam} />}></Route>
                        <Route
                            path="/settings"
                            element={
                            <Settings
                                ticks={ [clientTime, serverTime] }
                                now={ [getPrm, tickRel, offset]}
                                fontFamily={ fontFam }
                            />}
                        ></Route>
                    </Routes>
                </main>
            </ViewTransition>
        </Router>
    );
}


export default App;