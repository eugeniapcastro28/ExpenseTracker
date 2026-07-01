import { NavLink } from 'react-router-dom';
import { LayoutGrid, ArrowLeftRight, Plus as PlusIcon } from 'lucide-react';

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <LayoutGrid className="nav-icon" size={20} />
        <span className="nav-label">Dashboard</span>
      </NavLink>
      <NavLink to="/add" className="nav-add-btn">
        <PlusIcon size={26} />
      </NavLink>
      <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <ArrowLeftRight className="nav-icon" size={20} />
        <span className="nav-label">Transactions</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;