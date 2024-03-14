import './TabBar.css'

export default function TabBar({tab, setTab}){
    function tabClick(e){
        let buttonText= e.target.innerHTML
        if (buttonText=="Bats Over Time"){
            setTab("bot")
        }else if (buttonText=="Tree Widths"){
            setTab("tw")
        }else if (buttonText=="Bats Vs Tree Species"){
            setTab("bvts")
        }else{
            setTab("bvtw")
        }
    }

    return (
        <nav>
            <button onClick={tabClick} className={tab=="bot"?"selected":""}>Bats Over Time</button>
            <button onClick={tabClick} className={tab=="tw"?"selected":""}>Tree Widths</button>
            {/* <button onClick={tabClick} className={tab=="bvts"?"selected":""}>Bats Vs Tree Species</button>
            <button onClick={tabClick} className={tab=="bvtw"?"selected":""}>Bats Vs Tree Widths</button> */}
        </nav>
    )
}