const Database = require('../database/database');
const db = new Database()
const commonResponse = (status, message, data) => {
  return { status, message, data };
};

const gethome = async (req, res) => {
  try {
    const bannerQuery = 'SELECT * FROM add_banner WHERE is_deleted = false ORDER BY created_at DESC';
    const bannerResult = await db.pool.query(bannerQuery);

    const mainQuery = `
      SELECT
        service.*,
        CASE WHEN COUNT(category_with_products) = 0 THEN '[]'::jsonb ELSE jsonb_agg(category_with_products) END AS categories
      FROM
        service
      LEFT JOIN
        (
          SELECT
            category.*,
            CASE WHEN COUNT(sub_category_with_products) = 0 THEN '[]'::jsonb ELSE jsonb_agg(sub_category_with_products) END AS sub_categories
          FROM
            category
          LEFT JOIN
            (
              SELECT
                sub_category.*,
                CASE WHEN COUNT(products) = 0 THEN '[]'::jsonb ELSE jsonb_agg(products) END AS products
              FROM
                sub_category
              LEFT JOIN
                products ON sub_category.id = products.sub_category_id::INTEGER
              GROUP BY
                sub_category.id
            ) AS sub_category_with_products ON category.id = sub_category_with_products.category_id::INTEGER
          GROUP BY
            category.id
        ) AS category_with_products ON service.id = category_with_products.service_id::INTEGER
      WHERE
        service.is_deleted = false
      GROUP BY
        service.id;
    `;

    const mainResult = await db.pool.query(mainQuery);

    res.status(200).json({
      message: 'Data fetched successfully',
      banners: bannerResult.rows,
      data: mainResult.rows,
      status: 1
    });
  } catch (error) {
    console.error('An error occurred while fetching the data:', error);
    res.status(500).json({
      error: 'Internal server error',
      status: 0
    });
  }
};

module.exports = {
  gethome
};