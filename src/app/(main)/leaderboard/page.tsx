import { Metadata } from "next";
import { LeaderboardPage } from "./_components/clientPage";

export const metadata: Metadata = {

    title: 'Transaction Leaderboard',
    description: `Vazzzuniverse transaction leaderboard`
  
}
export default function Page(){
    return (
        <LeaderboardPage/>
    )
}