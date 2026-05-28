import os
import uuid
import datetime
from quart import Quart, jsonify, request, send_from_directory, session
import aiosqlite
from aiocryptopay import AioCryptoPay, Networks
import config

app = Quart(__name__)
app.secret_key = config.key

cc = AioCryptoPay(
    token=config.cpt,
    network=Networks.TEST_NET if config.ct else Networks.MAIN_NET
)

def gfd(d):
    f = datetime.datetime.utcnow() + datetime.timedelta(days=int(d))
    return f.strftime("%Y-%m-%d %H:%M:%S")

async def gu():
    u = session.get("uid")
    if u:
        async with aiosqlite.connect("db.sqlite") as d:
            async with d.execute("SELECT uid, l, b, ap, tg, ref, adm FROM u WHERE uid=?", (u,)) as c:
                r = await c.fetchone()
                if r:
                    return {"uid": r[0], "login": r[1], "balance": r[2], "activatedPayments": r[3], "telegramId": r[4], "referral": r[5], "admin": bool(r[6])}
    return None

async def fp(d, r, ui):
    pi = r[0]
    au = r[8]
    async with d.execute("SELECT l FROM u WHERE uid=?", (au,)) as c:
        ar = await c.fetchone()
        ln = ar[0] if ar else "Unknown"
    async with d.execute("SELECT s FROM r WHERE pid=?", (pi,)) as c:
        rs = await c.fetchall()
        ts = [rt[0] for rt in rs]
    cn = len(ts)
    av = sum(ts) / cn if cn > 0 else 0.0
    vr = 0
    if ui:
        async with d.execute("SELECT s FROM r WHERE pid=? AND uid=?", (pi, ui)) as c:
            v = await c.fetchone()
            if v: vr = v[0]
    cr = (r[1] == "approved") and (ui is not None)
    async with d.execute("SELECT url FROM img WHERE pid=?", (pi,)) as c:
        ir = await c.fetchall()
        im = [{"url": i[0]} for i in ir]
    return {
        "id": pi, "status": r[1], "title": r[2], "description": r[3], "downloads": r[7],
        "author": {"uid": au, "login": ln}, "rating": {"average": av, "count": cn},
        "viewerRating": vr, "canRate": cr,
        "config": {"filename": r[4], "size": r[5], "downloadUrl": r[6]},
        "images": im
    }

@app.before_serving
async def ini():
    os.makedirs("static", exist_ok=True)
    os.makedirs("assets", exist_ok=True)
    os.makedirs("static/files", exist_ok=True)
    os.makedirs("static/uploads", exist_ok=True)
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("CREATE TABLE IF NOT EXISTS u (uid INTEGER PRIMARY KEY AUTOINCREMENT, l TEXT UNIQUE, p TEXT, b REAL DEFAULT 0, ap INTEGER DEFAULT 0, tg TEXT, ref TEXT, adm INTEGER DEFAULT 0)")
        await d.execute("CREATE TABLE IF NOT EXISTS s (k TEXT PRIMARY KEY, pn TEXT, act INTEGER DEFAULT 1, frz INTEGER DEFAULT 0, exp TEXT, hw TEXT, jwt TEXT, uid INTEGER)")
        await d.execute("CREATE TABLE IF NOT EXISTS p (iid TEXT PRIMARY KEY, st TEXT, amt REAL, dys INTEGER, pid INTEGER, prv TEXT, url TEXT, sts INTEGER, uid INTEGER)")
        await d.execute("CREATE TABLE IF NOT EXISTS f (pid TEXT PRIMARY KEY, st TEXT, ttl TEXT, dsc TEXT, fnm TEXT, sz INTEGER, url TEXT, dls INTEGER DEFAULT 0, uid INTEGER)")
        await d.execute("CREATE TABLE IF NOT EXISTS img (pid TEXT, url TEXT)")
        await d.execute("CREATE TABLE IF NOT EXISTS r (pid TEXT, uid INTEGER, s INTEGER, PRIMARY KEY(pid, uid))")
        await d.execute("CREATE TABLE IF NOT EXISTS cfg (pe INTEGER DEFAULT 1)")
        await d.commit()
        async with d.execute("SELECT count(*) FROM cfg") as c:
            cnt = (await c.fetchone())[0]
        if cnt == 0:
            await d.execute("INSERT INTO cfg (pe) VALUES (1)")
            await d.commit()
        async with d.execute("SELECT count(*) FROM u") as c:
            ucnt = (await c.fetchone())[0]
        if ucnt == 0:
            await d.execute("INSERT INTO u (l, p, b, ap, tg, ref, adm) VALUES (?, ?, ?, ?, ?, ?, 1)", (config.al, config.ap, config.ab, config.aac, config.at, config.ar))
            await d.commit()

@app.after_serving
async def ccp():
    await cc.close()

@app.route("/static/<path:f>")
async def sst(f):
    return await send_from_directory("static", f)

@app.route("/assets/<path:f>")
async def ast(f):
    return await send_from_directory("assets", f)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
async def idx(path):
    if path.endswith((".js", ".css", ".png", ".jpg", ".mp4", ".json", ".zip", ".exe", ".dll", ".cs")):
        return await send_from_directory("static", path)
    return await send_from_directory("static", "index.html")

@app.route("/api/public-config")
async def gpb():
    return jsonify({"turnstileEnabled": False, "turnstileSiteKey": "", "csrfToken": "csrf_token_val_123"})

@app.route("/api/me")
async def gme():
    u = await gu()
    if not u:
        return jsonify({"detail": "UNAUTHORIZED"}), 401
    return jsonify({"user": u})

@app.route("/api/products")
async def gpd():
    return jsonify({
        "products": [
            {
                "productId": 1,
                "name": "Antilose External Desktop",
                "game": "Standoff 2",
                "active": True,
                "plans": {"14": 2.0, "30": 4.0},
                "telegramStarsPlans": {"14": 150, "30": 300},
                "description": {
                    "ru": "Antilose External Desktop — PC-версия Antilose для Standoff 2 с удобным лаунчером, большим функционалом, самодельным гипервизором, полным андетектом в read-only режиме, скрытием полностью всего функционала от записи и быстрым доступом к продукту.",
                    "en": "Antilose External Desktop is the PC version of Antilose for Standoff 2 with a polished launcher, broad functionality, a custom hypervisor, full undetect in read-only mode, complete concealment of all functionality from write access, and fast access to the product."
                }
            }
        ]
    })

@app.route("/api/users/<uid>")
async def gpr(uid):
    cu = await gu()
    async with aiosqlite.connect("db.sqlite") as d:
        async with d.execute("SELECT uid, l, b, ap, tg, ref, adm FROM u WHERE uid=?", (uid,)) as c:
            rw = await c.fetchone()
        if not rw:
            return jsonify({"detail": "USER_NOT_FOUND"}), 404
        if cu and str(cu["uid"]) == str(uid):
            async with d.execute("SELECT k, pn, act, frz, exp, hw, jwt FROM s WHERE uid=?", (uid,)) as c:
                s_rw = await c.fetchall()
            subs = [{"key": r[0], "productName": r[1], "active": bool(r[2]), "frozen": bool(r[3]), "expiresAt": r[4], "hwid": r[5], "jwtPreview": r[6]} for r in s_rw]
            async with d.execute("SELECT iid, st, amt, dys, pid, prv, url, sts FROM p WHERE uid=?", (uid,)) as c:
                p_rw = await c.fetchall()
            pays = [{"invoiceId": r[0], "status": r[1], "amount": r[2], "days": r[3], "productId": r[4], "provider": r[5], "checkoutUrl": r[6], "starsAmount": r[7]} for r in p_rw]
            async with d.execute("SELECT pe FROM cfg") as c:
                pe_rw = await c.fetchone()
            pe = bool(pe_rw[0]) if pe_rw else True
            ha = any(s["active"] and not s["frozen"] for s in subs)
            return jsonify({
                "isSelf": True,
                "user": cu,
                "subscriptions": subs,
                "invoices": pays,
                "payments": pays,
                "admin": cu["admin"],
                "forum": {"createState": "allowed" if ha else "subscription"},
                "settings": {"purchaseEnabled": pe}
            })
        else:
            async with d.execute("SELECT count(*) FROM s WHERE uid=? AND act=1 AND frz=0", (uid,)) as c:
                hs = (await c.fetchone())[0] > 0
            return jsonify({
                "isSelf": False,
                "user": {"uid": rw[0], "login": rw[1], "hasSubscription": hs}
            })

@app.route("/api/login", methods=["POST"])
async def lgn():
    dt = await request.get_json() or {}
    ln = dt.get("login")
    pw = dt.get("password")
    async with aiosqlite.connect("db.sqlite") as d:
        async with d.execute("SELECT uid, l, b, ap, tg, ref, adm FROM u WHERE l=? AND p=?", (ln, pw)) as c:
            r = await c.fetchone()
    if not r:
        return jsonify({"detail": "INVALID_CREDENTIALS"}), 400
    session["uid"] = str(r[0])
    return jsonify({
        "user": {"uid": r[0], "login": r[1], "balance": r[2], "activatedPayments": r[3], "telegramId": r[4], "referral": r[5]},
        "csrfToken": "csrf_token_val_123"
    })

@app.route("/api/register", methods=["POST"])
async def reg():
    dt = await request.get_json() or {}
    ln = dt.get("login")
    pw = dt.get("password")
    if not ln or not pw:
        return jsonify({"detail": "BAD_REQUEST"}), 400
    try:
        async with aiosqlite.connect("db.sqlite") as d:
            async with d.execute("INSERT INTO u (l, p, b, ap, tg, ref, adm) VALUES (?, ?, 0.0, 0, NULL, 'none', 0)", (ln, pw)) as c:
                ui = c.lastrowid
            await d.commit()
    except aiosqlite.IntegrityError:
        return jsonify({"detail": "LOGIN_TAKEN"}), 400
    session["uid"] = str(ui)
    return jsonify({
        "user": {"uid": ui, "login": ln, "balance": 0.0, "activatedPayments": 0, "telegramId": None, "referral": "none"},
        "csrfToken": "csrf_token_val_123"
    })

@app.route("/api/logout", methods=["POST"])
async def lgt():
    session.pop("uid", None)
    return jsonify({"success": True})

@app.route("/api/payment/create", methods=["POST"])
async def pcr():
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    dt = await request.get_json() or {}
    pi = dt.get("productId", 1)
    dy = dt.get("days", 30)
    am = dt.get("amount", 14.99)
    sid = int(dt.get("paymentSystemId", 0))
    if sid != 0:
        return jsonify({"detail": "STARS_API_ERROR_OR_NOT_SUPPORTED"}), 400
    prv = "CryptoBot"
    sts = 0
    if config.mk:
        ii = f"MOCK-{uuid.uuid4().hex[:8].upper()}"
        url = f"https://t.me/CryptoBot?start={ii}"
    else:
        try:
            inv = await cc.create_invoice(asset="USDT", amount=float(am))
            ii = str(inv.invoice_id)
            url = getattr(inv, "bot_invoice_url", getattr(inv, "pay_url", f"https://t.me/CryptoBot?start={inv.invoice_id}"))
        except Exception as e:
            return jsonify({"detail": f"CRYPTOMED_ERROR: {str(e)}"}), 400
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("INSERT INTO p (iid, st, amt, dys, pid, prv, url, sts, uid) VALUES (?, 'in_process', ?, ?, ?, ?, ?, ?, ?)", (ii, am, dy, pi, prv, url, sts, u["uid"]))
        await d.commit()
    return jsonify({
        "message": "Payment created",
        "payment": {"invoiceId": ii, "status": "in_process", "amount": am, "days": dy, "productId": pi, "provider": prv, "checkoutUrl": url, "starsAmount": sts}
    })

@app.route("/api/payment/check", methods=["POST"])
async def pck():
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    dt = await request.get_json() or {}
    ii = dt.get("invoiceId")
    ui = u["uid"]
    async with aiosqlite.connect("db.sqlite") as d:
        async with d.execute("SELECT iid, st, amt, dys, pid, prv, url, sts FROM p WHERE iid=? AND uid=?", (ii, ui)) as c:
            pr = await c.fetchone()
        if not pr:
            return jsonify({"detail": "NOT_FOUND"}), 404
        st = pr[1]
        prv = pr[5]
        if st == "in_process":
            if prv == "CryptoBot":
                if config.mk:
                    await d.execute("UPDATE p SET st='activated' WHERE iid=?", (ii,))
                    await d.execute("UPDATE u SET ap=ap+1 WHERE uid=?", (ui,))
                    k = f"key_{uuid.uuid4().hex[:8].upper()}"
                    pn = "Antilose Premium"
                    exp = gfd(pr[3])
                    hw = "HWID-" + uuid.uuid4().hex[:12].upper()
                    jwt = "JWT-" + uuid.uuid4().hex[:8].upper()
                    await d.execute("INSERT INTO s (k, pn, act, frz, exp, hw, jwt, uid) VALUES (?, ?, 1, 0, ?, ?, ?, ?)", (k, pn, exp, hw, jwt, ui))
                    await d.commit()
                    st = "activated"
                else:
                    try:
                        invs = await cc.get_invoices(invoice_ids=int(ii))
                        cb_st = invs[0].status.lower() if isinstance(invs, list) else invs.status.lower()
                        if cb_st == "paid":
                            await d.execute("UPDATE p SET st='activated' WHERE iid=?", (ii,))
                            await d.execute("UPDATE u SET ap=ap+1 WHERE uid=?", (ui,))
                            k = f"key_{uuid.uuid4().hex[:8].upper()}"
                            pn = "Antilose Premium"
                            exp = gfd(pr[3])
                            hw = "HWID-" + uuid.uuid4().hex[:12].upper()
                            jwt = "JWT-" + uuid.uuid4().hex[:8].upper()
                            await d.execute("INSERT INTO s (k, pn, act, frz, exp, hw, jwt, uid) VALUES (?, ?, 1, 0, ?, ?, ?, ?)", (k, pn, exp, hw, jwt, ui))
                            await d.commit()
                            st = "activated"
                        elif cb_st in ["expired", "fiat_expired"]:
                            await d.execute("UPDATE p SET st='canceled' WHERE iid=?", (ii,))
                            await d.commit()
                            st = "canceled"
                    except Exception as e:
                        return jsonify({"detail": f"CRYPTO_CHECK_ERROR: {str(e)}"}), 400
            elif prv == "TG_Stars":
                return jsonify({"detail": "STARS_API_ERROR_OR_NOT_SUPPORTED"}), 400
            else:
                await d.execute("UPDATE p SET st='activated' WHERE iid=?", (ii,))
                await d.execute("UPDATE u SET ap=ap+1 WHERE uid=?", (ui,))
                k = f"key_{uuid.uuid4().hex[:8].upper()}"
                pn = "Antilose Premium"
                exp = gfd(pr[3])
                hw = "HWID-" + uuid.uuid4().hex[:12].upper()
                jwt = "JWT-" + uuid.uuid4().hex[:8].upper()
                await d.execute("INSERT INTO s (k, pn, act, frz, exp, hw, jwt, uid) VALUES (?, ?, 1, 0, ?, ?, ?, ?)", (k, pn, exp, hw, jwt, ui))
                await d.commit()
                st = "activated"
        async with d.execute("SELECT iid, st, amt, dys, pid, prv, url, sts FROM p WHERE iid=? AND uid=?", (ii, ui)) as c:
            pr = await c.fetchone()
    return jsonify({
        "payment": {"invoiceId": pr[0], "status": pr[1], "amount": pr[2], "days": pr[3], "productId": pr[4], "provider": pr[5], "checkoutUrl": pr[6], "starsAmount": pr[7]}
    })

@app.route("/api/payment/cancel", methods=["POST"])
async def pcn():
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    dt = await request.get_json() or {}
    ii = dt.get("invoiceId")
    ui = u["uid"]
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("UPDATE p SET st='canceled' WHERE iid=? AND uid=?", (ii, ui))
        await d.commit()
        async with d.execute("SELECT iid, st, amt, dys, pid, prv, url, sts FROM p WHERE iid=? AND uid=?", (ii, ui)) as c:
            pr = await c.fetchone()
    if not pr: return jsonify({"detail": "NOT_FOUND"}), 404
    return jsonify({
        "payment": {"invoiceId": pr[0], "status": pr[1], "amount": pr[2], "days": pr[3], "productId": pr[4], "provider": pr[5], "checkoutUrl": pr[6], "starsAmount": pr[7]}
    })

@app.route("/api/subscription/freeze", methods=["POST"])
async def sfz():
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    dt = await request.get_json() or {}
    k = dt.get("key")
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("UPDATE s SET frz=1 WHERE k=? AND uid=?", (k, u["uid"]))
        await d.commit()
    return jsonify({"success": True})

@app.route("/api/subscription/unfreeze", methods=["POST"])
async def suf():
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    dt = await request.get_json() or {}
    k = dt.get("key")
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("UPDATE s SET frz=0 WHERE k=? AND uid=?", (k, u["uid"]))
        await d.commit()
    return jsonify({"success": True})

@app.route("/api/subscription/reset-hwid", methods=["POST"])
async def srh():
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    dt = await request.get_json() or {}
    k = dt.get("key")
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("UPDATE s SET hw=NULL WHERE k=? AND uid=?", (k, u["uid"]))
        await d.commit()
    return jsonify({"success": True})

@app.route("/api/forum/posts")
async def gps():
    u = await gu()
    ui = u["uid"] if u else None
    st = request.args.get("status", "approved")
    async with aiosqlite.connect("db.sqlite") as d:
        if st == "mine":
            if not ui: return jsonify({"posts": []})
            async with d.execute("SELECT pid, st, ttl, dsc, fnm, sz, url, dls, uid FROM f WHERE uid=?", (ui,)) as c:
                rws = await c.fetchall()
        else:
            async with d.execute("SELECT pid, st, ttl, dsc, fnm, sz, url, dls, uid FROM f WHERE st=?", (st,)) as c:
                rws = await c.fetchall()
        pl = []
        for r in rws:
            pl.append(await fp(d, r, ui))
    return jsonify({"posts": pl, "createState": True})

@app.route("/api/forum/posts/<pid>")
async def gpt(pid):
    u = await gu()
    ui = u["uid"] if u else None
    async with aiosqlite.connect("db.sqlite") as d:
        async with d.execute("SELECT pid, st, ttl, dsc, fnm, sz, url, dls, uid FROM f WHERE pid=?", (pid,)) as c:
            rw = await c.fetchone()
        if not rw:
            return jsonify({"detail": "NOT_FOUND"}), 404
        pd = await fp(d, rw, ui)
    return jsonify({"post": pd})

@app.route("/api/forum/posts/<pid>/rating", methods=["POST"])
async def rpt(pid):
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    dt = await request.get_json() or {}
    s = int(dt.get("stars", 5))
    ui = u["uid"]
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("INSERT OR REPLACE INTO r (pid, uid, s) VALUES (?, ?, ?)", (pid, ui, s))
        await d.commit()
        async with d.execute("SELECT pid, st, ttl, dsc, fnm, sz, url, dls, uid FROM f WHERE pid=?", (pid,)) as c:
            rw = await c.fetchone()
        pd = await fp(d, rw, ui)
    return jsonify({"post": pd})

@app.route("/api/forum/posts", methods=["POST"])
async def cpt():
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    fm = await request.form
    tl = fm.get("title")
    ds = fm.get("description")
    fl = await request.files
    cfg = fl.get("config")
    if not tl or not ds or not cfg:
        return jsonify({"detail": "BAD_REQUEST"}), 400
    pi = uuid.uuid4().hex[:12]
    fn = cfg.filename
    dr = "static/files"
    fp_v = os.path.join(dr, f"{pi}_{fn}")
    await cfg.save(fp_v)
    sz = os.path.getsize(fp_v)
    url = f"/static/files/{pi}_{fn}"
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("INSERT INTO f (pid, st, ttl, dsc, fnm, sz, url, dls, uid) VALUES (?, 'pending', ?, ?, ?, ?, ?, 0, ?)", (pi, tl, ds, fn, sz, url, u["uid"]))
        im = fl.getlist("images")
        idr = "static/uploads"
        for i, m in enumerate(im[:3]):
            ip = os.path.join(idr, f"{pi}_{i}_{m.filename}")
            await m.save(ip)
            await d.execute("INSERT INTO img (pid, url) VALUES (?, ?)", (pi, f"/static/uploads/{pi}_{i}_{m.filename}"))
        await d.commit()
    return jsonify({"success": True})

@app.route("/api/admin/summary")
async def asum():
    u = await gu()
    if not u or not u["admin"]: return jsonify({"detail": "FORBIDDEN"}), 403
    async with aiosqlite.connect("db.sqlite") as d:
        async with d.execute("SELECT count(*) FROM u") as c:
            ucnt = (await c.fetchone())[0]
        async with d.execute("SELECT count(*) FROM s") as c:
            scnt = (await c.fetchone())[0]
        async with d.execute("SELECT count(*) FROM s WHERE act=1") as c:
            asc = (await c.fetchone())[0]
        async with d.execute("SELECT count(*) FROM p WHERE st='in_process'") as c:
            pin = (await c.fetchone())[0]
        async with d.execute("SELECT count(*) FROM f WHERE st='pending'") as c:
            pfm = (await c.fetchone())[0]
        async with d.execute("SELECT pe FROM cfg") as c:
            pe_rw = await c.fetchone()
        pe = bool(pe_rw[0]) if pe_rw else True
    def gfi(fpath):
        ex = os.path.exists(fpath)
        return {"exists": ex, "size": os.path.getsize(fpath) if ex else 0, "sha256": config.hs}
    return jsonify({
        "purchaseEnabled": pe, "usersCount": ucnt, "subscriptionsCount": scnt,
        "activeSubscriptionsCount": asc, "pendingInvoicesCount": pin, "pendingForumCount": pfm,
        "files": {
            "loader": gfi("static/files/loader.exe"),
            "product": gfi("static/files/product.dll"),
            "dumpCs": gfi("static/files/dump.cs"),
            "scriptJson": gfi("static/files/script.json"),
            "modelAssets": gfi("static/files/model-assets.zip")
        }
    })

@app.route("/api/admin/users/<uuid_val>")
async def agu(uuid_val):
    u = await gu()
    if not u or not u["admin"]: return jsonify({"detail": "FORBIDDEN"}), 403
    async with aiosqlite.connect("db.sqlite") as d:
        async with d.execute("SELECT uid, l, b, ap, tg, ref FROM u WHERE uid=?", (uuid_val,)) as c:
            tg = await c.fetchone()
        if not tg: return jsonify({"detail": "NOT_FOUND"}), 404
        async with d.execute("SELECT pn, act, frz, exp, hw FROM s WHERE uid=?", (uuid_val,)) as c:
            s_rw = await c.fetchall()
        subs = [{"productName": r[0], "active": bool(r[1]), "frozen": bool(r[2]), "expiresAt": r[3], "hwid": r[4]} for r in s_rw]
    return jsonify({
        "user": {"uid": tg[0], "login": tg[1], "balance": tg[2], "activatedPayments": tg[3], "telegramId": tg[4], "referral": tg[5]},
        "subscriptions": subs
    })

@app.route("/api/admin/user/<ac>", methods=["POST"])
async def aua(ac):
    u = await gu()
    if not u or not u["admin"]: return jsonify({"detail": "FORBIDDEN"}), 403
    dt = await request.get_json() or {}
    tuid = dt.get("uid")
    async with aiosqlite.connect("db.sqlite") as d:
        if ac == "reset-hwid":
            await d.execute("UPDATE s SET hw=NULL WHERE uid=?", (tuid,))
        elif ac == "freeze":
            await d.execute("UPDATE s SET frz=1 WHERE uid=?", (tuid,))
        elif ac == "unfreeze":
            await d.execute("UPDATE s SET frz=0 WHERE uid=?", (tuid,))
        elif ac == "revoke-subscriptions":
            await d.execute("DELETE FROM s WHERE uid=?", (tuid,))
        elif ac == "grant-subscription":
            dys = int(dt.get("days", 30))
            k = f"key_{uuid.uuid4().hex[:8].upper()}"
            exp = gfd(dys)
            await d.execute("INSERT INTO s (k, pn, act, frz, exp, hw, jwt, uid) VALUES (?, 'Antilose Premium', 1, 0, ?, NULL, 'GRANTED', ?)", (k, exp, tuid))
        elif ac == "password":
            pwd = dt.get("password")
            await d.execute("UPDATE u SET p=? WHERE uid=?", (pwd, tuid))
        await d.commit()
        async with d.execute("SELECT uid, l, b, ap, tg, ref FROM u WHERE uid=?", (tuid,)) as c:
            tg = await c.fetchone()
        async with d.execute("SELECT pn, act, frz, exp, hw FROM s WHERE uid=?", (tuid,)) as c:
            s_rw = await c.fetchall()
        subs = [{"productName": r[0], "active": bool(r[1]), "frozen": bool(r[2]), "expiresAt": r[3], "hwid": r[4]} for r in s_rw]
    return jsonify({
        "user": {"uid": tg[0], "login": tg[1], "balance": tg[2], "activatedPayments": tg[3], "telegramId": tg[4], "referral": tg[5]},
        "subscriptions": subs
    })

@app.route("/api/admin/forum/posts/<pid>", methods=["POST"])
async def amp(pid):
    u = await gu()
    if not u or not u["admin"]: return jsonify({"detail": "FORBIDDEN"}), 403
    dt = await request.get_json() or {}
    ac = dt.get("action")
    st = "approved" if ac == "approve" else "rejected"
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("UPDATE f SET st=? WHERE pid=?", (st, pid))
        await d.commit()
    return jsonify({"success": True})

@app.route("/api/admin/files/<kd>", methods=["POST"])
async def auf(kd):
    u = await gu()
    if not u or not u["admin"]: return jsonify({"detail": "FORBIDDEN"}), 403
    fl = await request.files
    up = fl.get("upload")
    if not up: return jsonify({"detail": "BAD_REQUEST"}), 400
    mp = {
        "loader": "loader.exe", "product": "product.dll", "dump-cs": "dump.cs",
        "script-json": "script.json", "model-assets": "model-assets.zip"
    }
    fn = mp.get(kd)
    if not fn: return jsonify({"detail": "BAD_REQUEST"}), 400
    os.makedirs("static/files", exist_ok=True)
    await up.save(os.path.join("static/files", fn))
    return jsonify({"success": True})

@app.route("/api/admin/bulk/<ac>", methods=["POST"])
async def abk(ac):
    u = await gu()
    if not u or not u["admin"]: return jsonify({"detail": "FORBIDDEN"}), 403
    async with aiosqlite.connect("db.sqlite") as d:
        if ac == "reset-hwid":
            await d.execute("UPDATE s SET hw=NULL")
        elif ac == "freeze":
            await d.execute("UPDATE s SET frz=1")
        elif ac == "unfreeze":
            await d.execute("UPDATE s SET frz=0")
        await d.commit()
    return jsonify({"success": True})

@app.route("/api/admin/bulk/add-days", methods=["POST"])
async def abad():
    u = await gu()
    if not u or not u["admin"]: return jsonify({"detail": "FORBIDDEN"}), 403
    dt = await request.get_json() or {}
    dys = int(dt.get("days", 1))
    async with aiosqlite.connect("db.sqlite") as d:
        async with d.execute("SELECT k, exp FROM s") as c:
            rws = await c.fetchall()
        for r in rws:
            k = r[0]
            org = datetime.datetime.strptime(r[1], "%Y-%m-%d %H:%M:%S")
            ndt = org + datetime.timedelta(days=dys)
            await d.execute("UPDATE s SET exp=? WHERE k=?", (ndt.strftime("%Y-%m-%d %H:%M:%S"), k))
        await d.commit()
    return jsonify({"success": True})

@app.route("/api/admin/purchases", methods=["POST"])
async def apch():
    u = await gu()
    if not u or not u["admin"]: return jsonify({"detail": "FORBIDDEN"}), 403
    dt = await request.get_json() or {}
    en = int(dt.get("enabled", True))
    async with aiosqlite.connect("db.sqlite") as d:
        await d.execute("UPDATE cfg SET pe=?", (en,))
        await d.commit()
    return jsonify({"purchaseEnabled": bool(en)})

@app.route("/api/download/loader")
async def gld():
    u = await gu()
    if not u: return jsonify({"detail": "UNAUTHORIZED"}), 401
    async with aiosqlite.connect("db.sqlite") as d:
        async with d.execute("SELECT count(*) FROM s WHERE uid=? AND act=1 AND frz=0", (u["uid"],)) as c:
            hs = (await c.fetchone())[0] > 0
    if not hs:
        return jsonify({"detail": "SUBSCRIBE_REQUIRED"}), 403
    return await send_from_directory("static/files", "loader.exe")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
