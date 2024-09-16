module.exports = {
    format_date: (date) => {
      // Format date and time information to MM/DD/YYYY
      const d = new Date(date);
      const formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
      return `${formattedDate}`;
    },
  };


  const handlebars = require('handlebars');