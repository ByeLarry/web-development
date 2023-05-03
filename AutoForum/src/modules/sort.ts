
const sorter = (sort :string | undefined | string[]) => {
    if (typeof sort === "undefined") {
        return "ORDER BY id";
    };

    let sortType = "";
    switch (sort) {
      case "id":{
          sortType = "ORDER BY id";
          break;
      }
      case "asc":{
          sortType = "ORDER BY title ASC";
          break;
      }
      case "desc":{
          sortType = "ORDER BY title DESC";
          break;
      }
      default:{
          sortType = "ORDER BY id";
      break;
      }
    }
    return sortType;
}

export default sorter;