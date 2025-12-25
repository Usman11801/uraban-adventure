const SearchFilter = () => {
  return (
    <div className="container container-1400">
      <div
        className="search-filter-inner"
        data-aos="zoom-out-down"
        data-aos-duration={1500}
        data-aos-offset={50}
      >
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-map-marker-alt" />
          </div>
          <span className="title">Destinations</span>
          <select name="city" id="city">
            <option value="value1">City or Region</option>
            <option value="value2">City</option>
            <option value="value2">Region</option>
          </select>
        </div>
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-calendar-alt" />
          </div>
          <span className="title">Check In</span>
          <input type="date" name="checkin" id="checkin" />
        </div>
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-calendar-alt" />
          </div>
          <span className="title">Check Out</span>
          <input type="date" name="checkout" id="checkout" />
        </div>
        <div className="filter-item clearfix">
          <div className="icon">
            <i className="fal fa-user" />
          </div>
          <span className="title">Guest</span>
          <select name="guest" id="guest">
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4+ Guests</option>
          </select>
        </div>
        <div className="filter-btn">
          <button type="submit" className="theme-btn">
            <span data-hover="Search">Search</span>
            <i className="fal fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;

