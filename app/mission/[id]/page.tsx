import FilteredTasksProvider from "../contexts/filtered-tasks-context";
import MissionPageClient from "./components/MissionPageClient";

export default async function MissionIdPage() {
  return <FilteredTasksProvider>
    <MissionPageClient />
  </FilteredTasksProvider>;
}
