const connection = require ('./connection');

// const orders = module.exports = {};

function sqlGetPartyIdColumn(party) {
    return ['clientId', 'restaurantId', 'delivererId'][party];
}

function sqlGetRatingColumn(rater, ratee) {
    const PARTY_ABBR = ['C', 'R', 'D'];
    return 'rate' + PARTY_ABBR[rater] + PARTY_ABBR[ratee];
}

async function getUnrated(id, category) {
    const sqlquery = `
        SELECT
            id,
            orderTime,
            totalPrice,
            ${sqlGetRatingColumn(category, (category+1)%3)} AS rate0,
            ${sqlGetRatingColumn(category, (category+2)%3)} AS rate1
        FROM ORDERS
        WHERE ${sqlGetPartyIdColumn(category)} = ?`;
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
    getUnrated,
    rate,
};