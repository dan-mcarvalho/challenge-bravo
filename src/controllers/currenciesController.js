const Currency = require("../models/currency");
const Exchange = require("../services/exchange");

module.exports = {
    getCurrencies(req, res, next) {
        Currency.getAll()
            .then((data) =>
                res.status(200).json({ success: true, currency: data })
            )
            .catch((err) => res.status(400).json({ err }));
    },

    createCurrency(req, res, next) {
        const { name, code, exchange_rate } = req.body;

        if (!name || !code || !exchange_rate) {
            return res.status(400).json({ error: "Missing parameters" });
        }

        Currency.create(name, code, exchange_rate)
            .then(() =>
                res
                    .status(201)
                    .json({ success: true, msg: "New currency created" })
            )
            .catch((err) => res.status(400).json({ err }));
    },

    deleteCurrency(req, res, next) {
        let id = req.params.id;

        Currency.delete(id)
            .then((data) =>
                res.status(200).json({
                    success: true,
                    msg: `Currency #${id} deleted`,
                })
            )
            .catch((err) => res.status(400).json({ err }));
    },

    async exchangeCurrencies(req, res, next) {
        const { from = "USD", to = "BRL", amount = 1 } = req.query;

        const fromCode = from.toUpperCase();
        const toCode = to.toUpperCase();

        if (fromCode === "ETH" || toCode === "ETH") {
            try {
                await Exchange.getCrypto(fromCode, toCode, amount).then(
                    (data) => {
                        const rate = data;

                        const result = amount * rate;

                        const exchange = {
                            from: fromCode,
                            to: toCode,
                            amount: amount,
                            exchange_rate: rate,
                            result: result,
                        };
                        res.json({ exchange });
                    }
                );
            } catch (error) {
                res.json({ error });
            }
        } else {
            try {
                await Exchange.get(fromCode, toCode, amount).then((data) => {
                    const { result } = data;
                    const { rate } = data.info;

                    const exchange = {
                        from: fromCode,
                        to: toCode,
                        amount: amount,
                        exchange_rate: rate,
                        result: result,
                    };
                    res.json({ exchange });
                });
            } catch (error) {
                res.json({ error });
            }
        }
    },
};
