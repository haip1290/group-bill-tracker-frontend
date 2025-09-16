const NavBar = ({ user, handleLogout }) => {
  return (
    <nav>
      <span>Group Bill Tracker</span>
      <div>
        <span>Welcome, {user?.email}</span>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
};

export default NavBar;
