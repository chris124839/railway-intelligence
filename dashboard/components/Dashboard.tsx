const stations = [
  ["Kakinada Town","CCT","—","15:17","+2","Completed"],
  ["Samalkot","SLO","15:28","15:36","+8","Completed"],
  ["Anaparti","APT","15:49","16:01","+12","Completed"],
  ["Dwarapudi","DWP","15:54","16:09","+15","Completed"],
  ["Rajahmundry","RJY","16:48","17:09","+21","Current"],
  ["Nidadavolu","NDD","17:19","—","—","Upcoming"],
  ["Tadepalligudem","TDD","17:38","—","—","Upcoming"],
  ["Eluru","EE","18:25","—","—","Upcoming"]
];

const trend = [4,2,7,6,9,8,11,13,10,16,12,15,18,16,21,19,23,20,24,28,26,31,35,30,27,22,20,24,19,18];

export default function Dashboard() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">🚆</div><div><b>Indian Railways</b><span>Train Punctuality</span></div></div>
        {["Dashboard","All Trains","Live Trains","Stations","Analytics","About"].map((x,i)=>
          <div key={x} className={"nav "+(i===0?"active":"")}><span>{["▦","▣","◉","⌖","▥","ⓘ"][i]}</span>{x}</div>
        )}
        <div className="sideStats"><div>Total trains tracked<strong>13,523</strong></div><div>Running now<strong className="green">3,418</strong></div><div>Completed today<strong>6,287</strong></div></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="mobileBrand">Railway Punctuality</div><div className="search">Search train number, name or station… <b>⌕</b></div><div className="live"><i/> Live data<br/><small>Last updated 17 Sep 2026, 18:35 IST</small></div></header>

        <div className="kpis">
          <Kpi icon="🚆" value="3,418" label="Running Now" sub="25% of tracked trains" cls="green"/>
          <Kpi icon="✓" value="6,287" label="Completed Today" sub="46% of tracked trains"/>
          <Kpi icon="◷" value="3,818" label="Yet to Start" sub="28% of tracked trains" cls="orange"/>
          <Kpi icon="!" value="1,234" label="Delayed >30 min" sub="9% of tracked trains" cls="red"/>
        </div>

        <div className="gridTop">
          <section className="card hero">
            <div className="trainHead"><div className="number">17250</div><div><h1>Kakinada Town – Tirupati Express</h1><p>Kakinada Town (CCT) → Tirupati (TPTY)</p><div className="tags"><span>Daily</span><span>Express</span><span>ICF</span></div></div><div className="status">● Running <strong>+21 min</strong></div></div>
            <div className="facts"><Fact title="Current Station" value="Rajahmundry (RJY)"/><Fact title="Scheduled Departure" value="16:50"/><Fact title="Actual Departure" value="17:12" red/><Fact title="Next Station" value="Nidadavolu (NDD)"/><Fact title="Expected Arrival" value="17:33" red/></div>
            <h2>Today's Journey Progress</h2>
            <div className="progress">{stations.slice(0,8).map((s,i)=><div className={"stop "+(i<5?"done ":"")+(i===4?"current":"")} key={s[1]}><div className="dot"/><small>{s[1]}</small><em>{s[4]}</em></div>)}</div>
          </section>
          <section className="card">
            <h2>Live Train — 17250</h2>
            <div className="noMap"><div className="routeLine"><span>● CCT</span><span>● SLO</span><span>● APT</span><span>🔵 RJY</span><span>○ NDD</span><span>○ TPTY</span></div><div className="trainIcon">🚆</div><div className="locationText"><b>Rajahmundry</b><br/>Delay +21 min<br/><small>Map intentionally excluded</small></div></div>
          </section>
        </div>

        <section className="card">
          <h2>Station-wise Timings — Today</h2>
          <div className="tableWrap"><table><thead><tr><th>#</th><th>Station</th><th>Code</th><th>Sch. Arr</th><th>Sch. Dep</th><th>Actual Arr</th><th>Actual Dep</th><th>Arr Delay</th><th>Dep Delay</th><th>Status</th></tr></thead><tbody>
          {stations.map((s,i)=><tr className={s[5]==="Current"?"selected":""} key={s[1]}><td>{i+1}</td><td><b>{s[0]}</b></td><td>{s[1]}</td><td>{s[2]}</td><td>{i===0?"15:15":i===1?"15:30":i===2?"15:50":i===3?"15:55":i===4?"16:48":s[2]}</td><td>{s[3]}</td><td>{s[3] === "—"?"—":s[3]}</td><td className="delay">{s[4]}</td><td className="delay">{s[4]}</td><td>{s[5]}</td></tr>)}
          </tbody></table></div>
        </section>

        <div className="analytics">
          <section className="card"><h2>Historical Performance — Last 30 Runs</h2><div className="metricGrid"><Metric value="+17 min" label="Average delay"/><Metric value="+14 min" label="Median delay"/><Metric value="-2 min" label="Best run" good/><Metric value="+61 min" label="Worst run" bad/></div><div className="bars"><Bar label="On time" val="18%"/><Bar label="≤15 min late" val="57%"/><Bar label="≤30 min late" val="86%"/><Bar label=">30 min late" val="14%"/></div></section>
          <section className="card"><h2>Delay Trend — Last 30 Runs</h2><div className="spark">{trend.map((v,i)=><span key={i} style={{height:`${v*2.4}px`}} title={`${v} min`}/>)}</div><div className="axis"><span>30 runs ago</span><span>Most recent</span></div></section>
          <section className="card"><h2>Average Delay by Station</h2>{[["Tadepalligudem","+25"],["Eluru","+22"],["Nidadavolu","+19"],["Rajahmundry","+18"],["Dwarapudi","+14"],["Anaparti","+11"],["Samalkot","+7"],["Kakinada","+2"]].map(x=><div className="rank" key={x[0]}><span>{x[0]}</span><div><i style={{width:`${Math.max(8,parseInt(x[1])*3)}px`}}/></div><b>{x[1]} min</b></div>)}</section>
        </div>
      </section>
    </main>
  );
}
function Kpi({icon,value,label,sub,cls=""}:{icon:string,value:string,label:string,sub:string,cls?:string}){return <div className="kpi"><span className={cls}>{icon}</span><div><strong>{value}</strong><b>{label}</b><small>{sub}</small></div></div>}
function Fact({title,value,red=false}:{title:string,value:string,red?:boolean}){return <div><small>{title}</small><b className={red?"red":""}>{value}</b></div>}
function Metric({value,label,good=false,bad=false}:{value:string,label:string,good?:boolean,bad?:boolean}){return <div className={"metric "+(good?"good ":"")+(bad?"bad":"")}><b>{value}</b><span>{label}</span></div>}
function Bar({label,val}:{label:string,val:string}){return <div className="bar"><div><span>{label}</span><b>{val}</b></div><i style={{width:val}}/></div>}
