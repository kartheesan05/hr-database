import LogoutButton from './logout-button'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-blue-200 shadow-sm z-10">
      <div className="max-w-screen px-4 mx-auto flex justify-between items-center h-16">
        <h1 className="text-blue-800 text-2xl font-bold">HR Database</h1>
        <LogoutButton />
      </div>
    </nav>
  );
}

export default Navbar
