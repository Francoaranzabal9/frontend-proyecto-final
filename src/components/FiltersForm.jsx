import { useState } from 'react';
import { FaFilter, FaChevronUp, FaChevronDown } from 'react-icons/fa';

export const Filters = ({ filters, handleChange, handleSubmit, handleResetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="filters-sidebar">
      <button
        className="mobile-filter-toggle"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="toggle-text"><FaFilter /> Filtros</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      <div className={`filters-form ${isOpen ? 'mobile-visible' : ''}`}>
        <form onSubmit={handleSubmit} className="search-form">
          <div className="filters-grid">
            <input
              className="filter-input"
              type="text"
              placeholder="Nombre"
              name="name"
              value={filters.name}
              onChange={handleChange}
            />
            <input
              className="filter-input"
              type="text"
              placeholder="Marca"
              name="brand"
              value={filters.brand}
              onChange={handleChange}
            />
            <select
              className="filter-input"
              placeholder="Concentración"
              name="concentration"
              value={filters.concentration}
              onChange={handleChange}
            >
              <option value="">Concentración</option>
              <option value="EDP">EDP</option>
              <option value="EDT">EDT</option>
              <option value="Parfum">Parfum</option>
              <option value="EDC">EDC</option>
              <option value="Extrait">Extrait</option>
            </select>
            <select
              className="filter-input"
              placeholder="Género"
              name="genre"
              value={filters.genre}
              onChange={handleChange}
            >
              <option value="">Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Unisex">Unisex</option>
            </select>
            <input
              className="filter-input"
              type="text"
              placeholder="Precio minimo"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <input
              className="filter-input"
              type="text"
              placeholder="Precio maximo"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Buscar</button>
            <button type="button" onClick={handleResetFilters} className="btn btn-secondary">Resetear</button>
          </div>
        </form>
      </div>
    </aside>
  )
}