import { useState } from 'react';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import PriceRangeSlider from './PriceRangeSlider';

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="filter-accordion-item">
      <button
        type="button"
        className="accordion-header"
        onClick={onClick}
      >
        <span>{title}</span>
        {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
      </button>
      <div className={`accordion-content ${isOpen ? 'active' : ''}`}>
        <div className="accordion-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Filters = ({ filters, handleChange, handleSubmit, handleResetFilters, isOpen, onClose, priceLimits }) => {

  const [openSections, setOpenSections] = useState({
    name: false,
    brand: true,
    genre: true,
    price: true,
    concentration: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "" && value !== true && value !== false).length;

  return (
    <>
      <div className={`filter-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <div className={`filter-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Filtros</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); onClose(); }} className="drawer-content">

          <AccordionItem
            title="Nombre"
            isOpen={openSections.name}
            onClick={() => toggleSection('name')}
          >
            <input
              className="filter-input"
              type="text"
              placeholder="Buscar por nombre..."
              name="name"
              value={filters.name || ''}
              onChange={handleChange}
            />
          </AccordionItem>

          <AccordionItem
            title="Marca"
            isOpen={openSections.brand}
            onClick={() => toggleSection('brand')}
          >
            <input
              className="filter-input"
              type="text"
              placeholder="Buscar por marca..."
              name="brand"
              value={filters.brand || ''}
              onChange={handleChange}
            />
          </AccordionItem>

          <AccordionItem
            title="Género"
            isOpen={openSections.genre}
            onClick={() => toggleSection('genre')}
          >
            <select
              className="filter-input"
              name="genre"
              value={filters.genre || ''}
              onChange={handleChange}
            >
              <option value="">Todos</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Unisex">Unisex</option>
            </select>
          </AccordionItem>

          <AccordionItem
            title="Precio"
            isOpen={openSections.price}
            onClick={() => toggleSection('price')}
          >
            <div className="price-slider-wrapper" style={{ padding: '0 0.5rem' }}>
              <PriceRangeSlider
                min={filters.minPrice !== "" ? Number(filters.minPrice) : priceLimits?.min || 0}
                max={filters.maxPrice !== "" ? Number(filters.maxPrice) : priceLimits?.max || 1000000}
                minLimit={priceLimits?.min || 0}
                maxLimit={priceLimits?.max || 1000000}
                onChange={({ min, max }) => {
                  handleChange({ target: { name: 'minPrice', value: min } });
                  handleChange({ target: { name: 'maxPrice', value: max } });
                }}
              />
            </div>
          </AccordionItem>

          <AccordionItem
            title="Concentración"
            isOpen={openSections.concentration}
            onClick={() => toggleSection('concentration')}
          >
            <select
              className="filter-input"
              name="concentration"
              value={filters.concentration || ''}
              onChange={handleChange}
            >
              <option value="">Todas</option>
              <option value="EDP">EDP</option>
              <option value="EDT">EDT</option>
              <option value="Parfum">Parfum</option>
              <option value="EDC">EDC</option>
              <option value="Extrait">Extrait</option>
            </select>
          </AccordionItem>

          <AccordionItem
            title="Volumen (ml)"
            isOpen={openSections.volume}
            onClick={() => toggleSection('volume')}
          >
            <input
              className="filter-input"
              type="number"
              placeholder="Ej: 100"
              name="volumeMl"
              value={filters.volumeMl || ''}
              onChange={handleChange}
            />
          </AccordionItem>

        </form>

        <div className="drawer-footer">
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn btn-secondary"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={(e) => { handleSubmit(e); onClose(); }}
            className="btn btn-primary"
          >
            Aplicar {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
          </button>
        </div>
      </div>
    </>
  )
}