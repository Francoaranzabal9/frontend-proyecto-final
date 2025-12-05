
export const Filters = ({ filters, handleChange, handleSubmit, handleResetFilters }) => {
  return (
    <aside className="filters-sidebar">
      <div className="filters-form">
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
            <input
              className="filter-input"
              type="text"
              placeholder="Concentración"
              name="concentration"
              value={filters.concentration}
              onChange={handleChange}
            />
            <input
              className="filter-input"
              type="text"
              placeholder="Género"
              name="genre"
              value={filters.genre}
              onChange={handleChange}
            />
            <input
              className="filter-input"
              type="text"
              placeholder="Volumen (ml)"
              name="volumeMl"
              value={filters.volumeMl}
              onChange={handleChange}
            />
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
            <input
              className="filter-input"
              type="text"
              placeholder="Descripción"
              name="description"
              value={filters.description}
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