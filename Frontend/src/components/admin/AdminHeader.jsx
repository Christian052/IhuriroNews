import DarkModeToggleButton from "../../contexts/DarkModeToggleButton";

function AdminHeader() {
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      <DarkModeToggleButton />
    </header>
  );
}
export default AdminHeader;
