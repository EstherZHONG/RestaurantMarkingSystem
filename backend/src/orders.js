const connection = require ('./connection');

// const orders = module.exports = {};

function sqlGetPartyIdColumn(party) {
    return ['clientId', 'restaurantId', 'delivererId'][party];
}

function sqlGetRatingColumn(rater, ratee) {
    const PARTY_ABBR = ['C', 'R', 'D'];
    return 'rate' + PARTY_ABBR[rater] + PARTY_ABBR[ratee];
}

function getOrdersBy(category, sort) {
    switch(sort) {
      case 'unrated':
      return `CASE WHEN rate0 IS NULL AND rate1 IS NULL THEN NULL ELSE id END`;
      break;
      case 'rated':
      return `CASE WHEN rate0 IS NULL AND rate1 IS NULL THEN NULL ELSE -id END DESC`;
      break;
      case 'rate0':
      return `rate0 DESC`;
      break;
      case 'rate1':
      return `rate1 DESC`;
      break;
      case 'price':
      return 'totalPrice';
      break;
      case 'time':
      return 'orderTime DESC';
      break;
      default:
      return `CASE WHEN rate0 IS NULL AND rate1 IS NULL THEN NULL ELSE id END`;
      break;
    }
}

async function getOrders(id, category, sort, head, tail) {
    const sqlquery = `
        SELECT
            id,
            orderTime,
            totalPrice,
            ${sqlGetRatingColumn(category, (category+1)%3)} AS rate0,
            ${sqlGetRatingColumn(category, (category+2)%3)} AS rate1
        FROM ORDERS
        WHERE ${sqlGetPartyIdColumn(category)} = ?
        ORDER BY ${getOrdersBy(category, sort)}
        LIMIT ${head}, ${tail}`;
    // 'AND (' + RATES[category][(category+1)%3] + ' IS NULL OR ' + RATES[category][(category+2)%3] + ' IS NULL);';
    const [rows] = await connection.connection.execute(sqlquery, [id]);
    return rows;
    
}

async function rate(orderId, rater, ratee, rate) {
    const sqlquery = `UPDATE ORDERS SET ${sqlGetRatingColumn(rater, ratee)} = ? WHERE id = ?`;
    const [{ affectedRows }] = await connection.connection.execute(sqlquery, [rate, orderId]);
    if (!affectedRows) {
        throw { message: 'No specified order' };
    }
}

module.exports = {
    getOrders,
    rate,
};