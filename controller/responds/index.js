/**
 * @author iNahoo
 * @since 2017/11/29.
 */
"use strict";

module.exports = {

    /**
     * @param ctx
     * @param md
     */
    markdown(ctx, md) {
        ctx.body = JSON.stringify({
            success: true,
            errorCode: String(200),
            errorMsg: "",
            fields: {
                markdown: md,
            },
        })
    }

};