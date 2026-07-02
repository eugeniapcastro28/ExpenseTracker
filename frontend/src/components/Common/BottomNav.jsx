import { NavLink } from 'react-router-dom';
import { LayoutGrid, ArrowLeftRight, Plus as PlusIcon } from 'lucide-react';

function BottomNav({ pendingCount, onAddClick }) {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">⊞</span>
        <span className="nav-label">Dashboard</span>
      </NavLink>
      <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">↕</span>
        <span className="nav-label">Transactions</span>
      </NavLink>
      <button className="nav-add-btn" onClick={onAddClick}>
        <span>+</span>
      </button>
      <NavLink to="/recurring" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <span className="nav-icon">↻</span>
          {pendingCount > 0 && (
            <span className="nav-badge">{pendingCount}</span>
          )}
        </div>
        <span className="nav-label">Recurring</span>
      </NavLink>
      <NavLink to="/expenses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">↓</span>
        <span className="nav-label">Expenses</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;