import React from "react"
import CheckIcon from './assets/CheckIcon'
import InfoIcon from './assets/InfoIcon'
import MinusIcon from './assets/MinusIcon'
import PlusIcon from './assets/PlusIcon'
import CloseIcon from './assets/CloseIcon'
import styles from './Css'
import './App.css'

const OFFER_STRING = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty']
const NUMBER_COUNT = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th']

const useRefDimensions = (ref) => {
    const [dimensions, setDimensions] = React.useState({ width: 1, height: 2 })
    React.useEffect(() => {
        if (ref.current) {
            const { current } = ref
            const boundingRect = current.getBoundingClientRect()
            const { width, height } = boundingRect
            setDimensions({ width: Math.round(width), height: Math.round(height) })
        }
    }, [ref])
    return dimensions
}

export default function Main() {
    const API_URL = "https://www.amgw.co.uk/"
    const [infoStatus, setModalInfoStatus] = React.useState(0)
    const [products, setProducts] = React.useState({})
    const [OFFER, setOFFER] = React.useState({})
    const [USBCUSBC, setUSBCUSBC] = React.useState(0)
    const [USBCLGT, setUSBCLGT] = React.useState(0)
    const [BONUSUSB, setBONUSUSB] = React.useState(1)
    const [BONUSLGT, setBONUSLGT] = React.useState(0)
    const [UPGRADE, setUPGRADE] = React.useState(false)
    const [ADUSBA, setADUSBA] = React.useState(0)
    const [ADMICRO, setADMICRO] = React.useState(0)
    const [bonusCount, setBonusCount] = React.useState(1)
    const [selectedBonus, setSelectedBonus] = React.useState("")
    const [selectedBonusCalc, setSelectedBonusCalc] = React.useState(3)
    const [modalStatus, setModalStatus] = React.useState(false)
    const [route, setRoute] = React.useState(0)
    const [totalPrice, setTotalPrice] = React.useState(0)
    const [checkoutList, setCheckoutList] = React.useState([])
    const [checkoutId, setCheckoutId] = React.useState("")
    const [next, setNext] = React.useState(1)
    const divRef = React.createRef()
    const dimensions = useRefDimensions(divRef)

    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        })
    }, [route])

    React.useEffect(() => {
        var arr = {}
        for (var i = 1; i < 100; i++) {
            let bonus = Math.abs(Math.ceil(i / 2 - 1))
            arr[i] = bonus
        }
        setOFFER(arr)
        async function getProduct() {
            const response = await fetch(API_URL + "shopifyAPI/getProducts")
            const data = await response.json()
            setProducts(data)
            console.log(data)
        }
        getProduct()
    }, [])

    React.useEffect(() => {
        var calc = OFFER[USBCUSBC + USBCLGT] ? OFFER[USBCUSBC + USBCLGT] + 1 : 1
        setBonusCount(calc)
        setBONUSUSB(calc)
        setSelectedBonus(OFFER_STRING[OFFER[USBCUSBC + USBCLGT] - 1])

        if (USBCUSBC + USBCLGT > 0) {
            var NEXT = OFFER[USBCUSBC + USBCLGT] + 1
            var nextKey = Object.keys(OFFER).find((k) => OFFER[k] === NEXT)
            setNext(NEXT)

            if (nextKey >= USBCUSBC + USBCLGT)
                setSelectedBonusCalc(nextKey - USBCUSBC - USBCLGT)
            else setSelectedBonusCalc(0)
        }
    }, [USBCUSBC, USBCLGT])

    const changeBonus = (index) => {
        var calc = OFFER[USBCUSBC + USBCLGT] ? OFFER[USBCUSBC + USBCLGT] + 1 : 1
        var count = 0
        if (index === "minus") {
            if (BONUSLGT > 0) {
                count = BONUSLGT - 1
                setBONUSLGT(BONUSLGT - 1)
            } else {
                setBONUSLGT(0)
            }
        } else {
            if (BONUSLGT < bonusCount) {
                count = BONUSLGT + 1
                setBONUSLGT(BONUSLGT + 1)
            } else {
                setBONUSLGT(bonusCount)
            }
        }
        setBONUSUSB(calc - count)
    }

    const clickViewSummary = () => {
        console.log(
            "USBCUSBC",
            USBCUSBC,
            "USBCLGT",
            USBCLGT,
            "BONUSUSB",
            BONUSUSB,
            "BONUSLGT",
            BONUSLGT,
            "UPGRADE",
            UPGRADE,
            "ADUSBA",
            ADUSBA,
            "ADMICRO",
            ADMICRO
        )
        if (UPGRADE === true)
            var upgradePrice =
                (BONUSUSB + BONUSLGT) *
                products["customGoldPlatedUsbAAdapter"].variants.edges[0].node
                    .price
        else var upgradePrice = 0
        var total =
            USBCUSBC * products["usbCtoUsb"].variants.edges[0].node.price +
            USBCLGT * products["usbCtoLightning"].variants.edges[0].node.price +
            BONUSLGT *
            products["switchToLightning"].variants.edges[0].node.price +
            ADUSBA * products["usbAAdapter4pack"].variants.edges[0].node.price +
            ADMICRO *
            products["microUsbAdapter4pack"].variants.edges[0].node.price +
            upgradePrice
        setTotalPrice(total.toFixed(2))
        var newArray = []
        if (USBCUSBC !== 0)
            newArray.push({
                variantId: products["usbCtoUsb"].variants.edges[0].node.id,
                quantity: USBCUSBC,
            })
        if (USBCLGT !== 0)
            newArray.push({
                variantId:
                    products["usbCtoLightning"].variants.edges[0].node.id,
                quantity: USBCLGT,
            })
        if (BONUSLGT !== 0)
            newArray.push({
                variantId:
                    products["switchToLightning"].variants.edges[0].node.id,
                quantity: BONUSLGT,
            })
        if (UPGRADE === true)
            newArray.push({
                variantId:
                    products["customGoldPlatedUsbAAdapter"].variants.edges[0]
                        .node.id,
                quantity: bonusCount,
            })
        if (ADUSBA !== 0)
            newArray.push({
                variantId:
                    products["usbAAdapter4pack"].variants.edges[0].node.id,
                quantity: ADUSBA,
            })
        if (ADMICRO !== 0)
            newArray.push({
                variantId:
                    products["microUsbAdapter4pack"].variants.edges[0].node.id,
                quantity: ADMICRO,
            })
        if (newArray.length === 0)
            newArray.push({
                variantId:
                    products["freeBonusLuxUsbC"].variants.edges[0].node.id,
                quantity: 1,
            })
        else
            newArray.push({
                variantId:
                    products["freeBonusLuxUsbC"].variants.edges[0].node.id,
                quantity: BONUSUSB + BONUSLGT,
            })

        setCheckoutList(newArray)
        fetch(API_URL + "shopifyAPI/createCheckOut", {
            method: "POST",
            body: JSON.stringify({
                id: newArray[0].variantId,
                quantity: newArray[0].quantity,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((json) => {
                setCheckoutId(json.id)
                setRoute(2)
            })
    }

    const clickCheckout = () => {
        fetch(API_URL + "shopifyAPI/updateCheckOut", {
            method: "POST",
            body: JSON.stringify({ id: checkoutId, lineItems: checkoutList }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((json) => {
                window.location.href = json.webUrl
            })
    }

    return (
        <div style={styles.App} className="main">
            {route === 0 ? (
                <div style={styles.firstCard}>
                    <div>
                        <img
                            style={styles.headerImage}
                            src={API_URL + "image/first.png"}
                            alt="first"
                        />
                    </div>
                    <div style={styles.bodyMargin}>
                        <h3 style={styles.firstH3}>Your FREE Lux Cables</h3>
                        <h5 style={styles.firstH5}>
                            Your first Lux cable is FREE
                        </h5>
                        <div>
                            <ul style={styles.ulFontSize}>
                                <li style={styles.marginBottom15}>
                                    You only <strong>need</strong> to pay $7
                                    shipping processing & handing and have no
                                    obligation to <strong>add more</strong>.
                                </li>
                                <li style={styles.marginBottom15}>
                                    If{" "}
                                    <strong>
                                        you'll choose to buy 3 or more Lux
                                        cables
                                    </strong>{" "}
                                    you'll earn additional complimentary cables.
                                </li>
                                <li style={styles.marginBottom15}>
                                    The free <strong>USB-C to USB-C</strong>{" "}
                                    cables themselves are identical to those{" "}
                                    <strong>you will purchase</strong> just
                                    without the gorgeous, premium packaging and
                                    USB-A adapter.
                                </li>
                                <li style={styles.marginBottom15}>
                                    You may{" "}
                                    <strong>
                                        add premium packaging and USB-A adapters
                                    </strong>{" "}
                                    at just a nominal cost if you want to.
                                </li>
                                <li style={styles.marginBottom15}>
                                    You'll pre-order{" "}
                                    <strong>other MAGFAST products</strong>{" "}
                                    after Lux checkout.
                                </li>
                            </ul>
                        </div>
                        <div className={"firstBtnGroup"}>
                            <div className={"button"}>
                                <button
                                    style={styles.understand}
                                    onClick={() => setRoute(1)}
                                >
                                    All Understood
                                </button>
                            </div>
                            <div className={"button"}>
                                <button
                                    style={styles.included}
                                    onClick={() => setModalStatus(true)}
                                >
                                    What's included with Lux
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}

            {route === 1 && products["usbCtoUsb"] ? (
                <>
                    <div style={styles.secondCard}>
                        <div style={styles.relative}>
                            <img
                                style={styles.headerImage}
                                src={API_URL + "image/more.png"}
                                alt="more"
                            />
                        </div>
                        <div style={styles.bodyMargin}>
                            <div style={styles.moreTitle}>
                                <div style={styles.moreWant}>
                                    How Many More Do You Want?
                                </div>
                                <ul style={styles.moreUl}>
                                    <li>Buy 3 Lux get 1 more FREE</li>
                                    <li>
                                        <strong>
                                            Buy 5 Lux get 2 more FREE
                                        </strong>
                                    </li>
                                    <li>Buy 7 Lux get 3 more FREE</li>
                                </ul>
                                <div style={styles.ulDescription}>
                                    Add more to see even more...
                                </div>
                            </div>
                            <div style={styles.description}>
                                Lux cables are{" "}
                                <strong>perfect for gifting</strong> and
                                warrantied for life - and so order for all your
                                family.
                            </div>
                            <div
                                style={styles.flex}
                                className={
                                    USBCUSBC > 0
                                        ? "customGreenBorder"
                                        : "customBorder"
                                }
                            >
                                <div>
                                    <img
                                        src={API_URL + "image/usbc_usbc.png"}
                                        style={styles.image}
                                        alt="usbc_usbc"
                                    />
                                </div>
                                <div style={styles.padding15}>
                                    <div style={styles.fontSize25}>
                                        $
                                        {(
                                            products["usbCtoUsb"].variants
                                                .edges[0].node.price * 1
                                        ).toFixed(0)}
                                        /cable
                                    </div>
                                    <div style={styles.fontSize27}>
                                        <strong>
                                            {products["usbCtoUsb"].title}
                                        </strong>
                                    </div>
                                    <div
                                        style={styles.infoIcon}
                                        onClick={() => setModalInfoStatus(1)}
                                    >
                                        <InfoIcon />
                                    </div>
                                    <div style={styles.exceptDevice}>
                                        Get these cables for all new devices{" "}
                                        <i>except</i> Apple iPhone.
                                    </div>
                                    <div style={styles.buttonGroup}>
                                        <button
                                            style={styles.changeButton}
                                            className="customBtn"
                                            onClick={() =>
                                                USBCUSBC > 0
                                                    ? setUSBCUSBC(USBCUSBC - 1)
                                                    : setUSBCUSBC(0)
                                            }
                                        >
                                            <div style={styles.change}>
                                                <MinusIcon />
                                            </div>
                                        </button>
                                        <div style={styles.count}>
                                            {USBCUSBC}
                                        </div>
                                        <button
                                            style={styles.changeButton}
                                            className="customBtn"
                                            onClick={() =>
                                                setUSBCUSBC(USBCUSBC + 1)
                                            }
                                        >
                                            <div style={styles.change}>
                                                <PlusIcon />
                                            </div>
                                        </button>
                                    </div>
                                    <div style={styles.bottomDescription}>
                                        All Lux cables have gold-plated USB
                                        connections and PD Power Delivery
                                        technology to maximise charge speeds.
                                    </div>
                                </div>
                            </div>
                            <div
                                style={styles.flex}
                                className={
                                    USBCLGT > 0
                                        ? "customGreenBorder"
                                        : "customBorder"
                                }
                            >
                                <div>
                                    <img
                                        src={
                                            API_URL + "image/lightning_usbc.png"
                                        }
                                        style={styles.image}
                                        alt="lightning_usbc"
                                    />
                                </div>
                                <div style={styles.padding15}>
                                    <div style={styles.fontSize25}>
                                        $
                                        {(
                                            products["usbCtoLightning"].variants
                                                .edges[0].node.price * 1
                                        ).toFixed(0)}
                                        /cable
                                    </div>
                                    <div style={styles.fontSize27}>
                                        <strong>
                                            {products["usbCtoLightning"].title}
                                        </strong>
                                    </div>
                                    <div
                                        style={styles.infoIcon}
                                        onClick={() => setModalInfoStatus(2)}
                                    >
                                        <InfoIcon />
                                    </div>
                                    <div style={styles.exceptDevice}>
                                        Get these cables for iPhone and older
                                        Apple devices.
                                    </div>
                                    <div style={styles.buttonGroup}>
                                        <button
                                            style={styles.changeButton}
                                            className="customBtn"
                                            onClick={() =>
                                                USBCLGT > 0
                                                    ? setUSBCLGT(USBCLGT - 1)
                                                    : setUSBCLGT(0)
                                            }
                                        >
                                            <div style={styles.change}>
                                                <MinusIcon />
                                            </div>
                                        </button>
                                        <div style={styles.count}>
                                            {USBCLGT}
                                        </div>
                                        <button
                                            style={styles.changeButton}
                                            className="customBtn"
                                            onClick={() =>
                                                setUSBCLGT(USBCLGT + 1)
                                            }
                                        >
                                            <div style={styles.change}>
                                                <PlusIcon />
                                            </div>
                                        </button>
                                    </div>
                                    <div style={styles.bottomDescription}>
                                        Lux Lightning cables are MFI-certified
                                        which means that Apple has both supplied
                                        the Lightning connector and certified
                                        the design.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="freeCard"
                        style={{
                            bottom: -(
                                dimensions.height -
                                dimensions.height / 7 +
                                50
                            ),
                        }}
                        ref={divRef}
                    >
                        <div style={styles.bodyMargin}>
                            <div>
                                <div style={styles.freeCardTitle}>
                                    <div style={styles.countTitle}>
                                        {bonusCount}
                                    </div>
                                    <div style={styles.freeTitle}>
                                        FREE <br />{" "}
                                        {bonusCount > 1
                                            ? "Bonus Cables"
                                            : "Bonus Cable"}
                                    </div>
                                </div>
                                <ul style={styles.m0}>
                                    <li>
                                        Add {selectedBonusCalc} more Lux{" "}
                                        {selectedBonusCalc > 1
                                            ? "cables"
                                            : "cable"}{" "}
                                        to get a {NUMBER_COUNT[next]} one FREE
                                    </li>
                                </ul>
                                <div style={styles.luxCount}>
                                    <strong>One Lux</strong> as promised because
                                    you attended our demo...
                                </div>
                                {selectedBonus && (
                                    <div style={styles.luxCount}>
                                        <strong>
                                            {selectedBonus} more Lux
                                        </strong>{" "}
                                        because you've got {USBCUSBC + USBCLGT}{" "}
                                        selected to buy.
                                    </div>
                                )}

                                <div style={styles.chooseFont}>
                                    Choose add-ons for your {bonusCount}{" "}
                                    {bonusCount > 1
                                        ? "Bonus Cables"
                                        : "Bonus Cable"}
                                </div>
                            </div>
                            <div
                                style={styles.flex}
                                className={
                                    BONUSLGT > 0
                                        ? "customGreenBorder"
                                        : "customBorder"
                                }
                            >
                                <div>
                                    <img
                                        src={
                                            API_URL +
                                            "image/switch_lightning.png"
                                        }
                                        style={styles.image}
                                        alt="switch_lightning"
                                    />
                                </div>
                                <div style={styles.padding15}>
                                    <div style={styles.fontSize25}>
                                        $
                                        {(
                                            products["switchToLightning"]
                                                .variants.edges[0].node.price *
                                            1
                                        ).toFixed(0)}{" "}
                                        per cable
                                    </div>
                                    <div style={styles.fontSize27}>
                                        <strong>
                                            {
                                                products["switchToLightning"]
                                                    .title
                                            }
                                        </strong>
                                    </div>
                                    <div
                                        style={styles.infoIcon}
                                        onClick={() => setModalInfoStatus(3)}
                                    >
                                        <InfoIcon />
                                    </div>
                                    <div style={styles.buttonGroup}>
                                        <button
                                            style={styles.changeButton}
                                            className="customBtn"
                                            onClick={() => changeBonus("minus")}
                                        >
                                            <div style={styles.change}>
                                                <MinusIcon />
                                            </div>
                                        </button>
                                        <div style={styles.count}>
                                            {BONUSLGT}
                                        </div>
                                        <button
                                            style={styles.changeButton}
                                            className="customBtn"
                                            onClick={() => changeBonus("plus")}
                                        >
                                            <div style={styles.change}>
                                                <PlusIcon />
                                            </div>
                                        </button>
                                    </div>
                                    <div style={styles.freeBonus}>
                                        of your {bonusCount}{" "}
                                        {bonusCount > 1
                                            ? "Bonus Cables"
                                            : "Bonus Cable"}
                                    </div>
                                    <div style={styles.bottomDescription}>
                                        MAGFAST Lux cables are MFi certified
                                        which means that Apple has both supplied
                                        the Lightning Tip and certified the
                                        design.
                                    </div>
                                </div>
                            </div>
                            <div
                                style={styles.flex}
                                className={
                                    UPGRADE === true
                                        ? "customGreenBorder"
                                        : "customBorder"
                                }
                            >
                                <div style={styles.upgradeImageDiv}>
                                    <img
                                        src={API_URL + "image/upgrade_1.png"}
                                        style={styles.upgradeImage}
                                        alt="upgrade"
                                    />
                                </div>
                                <div style={styles.padding15}>
                                    <div style={styles.fontSize25}>
                                        $
                                        {(
                                            products[
                                                "customGoldPlatedUsbAAdapter"
                                            ].variants.edges[0].node.price * 1
                                        ).toFixed(0)}{" "}
                                        per FREE cable
                                    </div>
                                    <div style={styles.fontSize27}>
                                        <strong>
                                            {
                                                products[
                                                    "customGoldPlatedUsbAAdapter"
                                                ].title
                                            }
                                        </strong>
                                    </div>
                                    <div
                                        style={styles.infoIcon}
                                        onClick={() => setModalInfoStatus(4)}
                                    >
                                        <InfoIcon />
                                    </div>
                                    <div style={{ marginTop: "40px" }}></div>
                                    <div style={styles.bottomDescription}>
                                        Included with all purchased Lux cables,
                                        add the USB-A adapter to use your Lux
                                        with your old outlets, and get our
                                        premium packaging and lifetime 'Lost &
                                        Found' service.
                                    </div>
                                    <div style={{ marginTop: "40px" }}></div>
                                    <div style={styles.between}>
                                        <div
                                            style={
                                                UPGRADE
                                                    ? styles.permissionBtnNo
                                                    : styles.permissionBtnYes
                                            }
                                            onClick={() => setUPGRADE(false)}
                                        >
                                            No
                                        </div>
                                        <div
                                            style={
                                                UPGRADE
                                                    ? styles.permissionBtnYes
                                                    : styles.permissionBtnNo
                                            }
                                            onClick={() => setUPGRADE(true)}
                                        >
                                            Yes
                                        </div>
                                    </div>
                                    <div style={styles.freeBonus}>
                                        ${bonusCount * 7} for {bonusCount}{" "}
                                        upgrades
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        style={styles.flex}
                        className={
                            ADUSBA > 0
                                ? "maxWidth customGreenBorder"
                                : "maxWidth customBorder"
                        }
                    >
                        <div>
                            <img
                                src={API_URL + "image/usba_adapters.png"}
                                style={styles.image}
                                alt="usba_adapters"
                            />
                        </div>
                        <div style={styles.padding15}>
                            <div style={styles.fontSize25}>
                                $
                                {(
                                    products["usbAAdapter4pack"].variants
                                        .edges[0].node.price * 1
                                ).toFixed(0)}{" "}
                                per 4-pack
                            </div>
                            <div style={styles.fontSize27}>
                                <strong>
                                    {products["usbAAdapter4pack"].title}
                                </strong>
                            </div>
                            <div
                                style={styles.infoIcon}
                                onClick={() => setModalInfoStatus(5)}
                            >
                                <InfoIcon />
                            </div>
                            <div style={{ fontSize: "20px" }}>
                                This gold-plated USB-A adapter makes the cable
                                of the future work with outlets and chargers of
                                the past.{" "}
                            </div>
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.changeButton}
                                    className="customBtn"
                                    onClick={() =>
                                        ADUSBA > 0
                                            ? setADUSBA(ADUSBA - 1)
                                            : setADUSBA(0)
                                    }
                                >
                                    <div style={styles.change}>
                                        <MinusIcon />
                                    </div>
                                </button>
                                <div style={styles.count}>{ADUSBA}</div>
                                <button
                                    style={styles.changeButton}
                                    className="customBtn"
                                    onClick={() => setADUSBA(ADUSBA + 1)}
                                >
                                    <div style={styles.change}>
                                        <PlusIcon />
                                    </div>
                                </button>
                            </div>
                            <div style={styles.freeBonus}>4-pack</div>
                            <div style={styles.bottomDescription}>
                                You'll get a total of{" "}
                                {ADUSBA * 4 + USBCUSBC + USBCLGT} USB-A
                                adapters: <br />({USBCUSBC + USBCLGT} with your
                                purchased Lux and {ADUSBA} x 4 = {ADUSBA * 4}{" "}
                                selected here)
                            </div>
                        </div>
                    </div>

                    <div
                        style={styles.flex}
                        className={
                            ADMICRO > 0
                                ? "maxWidth customGreenBorder"
                                : "maxWidth customBorder"
                        }
                    >
                        <div>
                            <img
                                src={API_URL + "image/micro_adapters.png"}
                                style={styles.image}
                                alt="micro_adapters"
                            />
                        </div>
                        <div style={styles.padding15}>
                            <div style={styles.fontSize25}>
                                $
                                {(
                                    products["microUsbAdapter4pack"].variants
                                        .edges[0].node.price * 1
                                ).toFixed(0)}{" "}
                                per 4-pack
                            </div>
                            <div style={styles.fontSize27}>
                                <strong>
                                    {products["microUsbAdapter4pack"].title}
                                </strong>
                            </div>
                            <div
                                style={styles.infoIcon}
                                onClick={() => setModalInfoStatus(6)}
                            >
                                <InfoIcon />
                            </div>
                            <div style={{ fontSize: "20px" }}>
                                Adapts Lux for much older phones and many of the
                                other more modern devices you have
                            </div>
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.changeButton}
                                    className="customBtn"
                                    onClick={() =>
                                        ADMICRO > 0
                                            ? setADMICRO(ADMICRO - 1)
                                            : setADMICRO(0)
                                    }
                                >
                                    <div style={styles.change}>
                                        <MinusIcon />
                                    </div>
                                </button>
                                <div style={styles.count}>{ADMICRO}</div>
                                <button
                                    style={styles.changeButton}
                                    className="customBtn"
                                    onClick={() => setADMICRO(ADMICRO + 1)}
                                >
                                    <div style={styles.change}>
                                        <PlusIcon />
                                    </div>
                                </button>
                            </div>
                            <div style={styles.freeBonus}>4-pack</div>
                            <div style={styles.bottomDescription}>
                                You’ll get a total of {ADMICRO * 4} Micro-USB
                                adapters
                            </div>
                        </div>
                    </div>
                    <div style={styles.bottomBtnGroup}>
                        <button
                            style={styles.bottomBtn}
                            onClick={() => setRoute(0)}
                        >
                            Back
                        </button>
                        <button
                            style={styles.bottomBtn}
                            onClick={() => clickViewSummary()}
                        >
                            View Summary
                        </button>
                    </div>
                </>
            ) : (
                ""
            )}

            {route === 2 ? (
                <div>
                    <div style={styles.summaryCard}>
                        <div style={styles.summaryBody}>
                            <div style={styles.summaryTitle}>Summary</div>
                            <div style={styles.summarySubTitle}>
                                You're Getting{" "}
                                {USBCUSBC +
                                    USBCLGT +
                                    BONUSUSB +
                                    BONUSLGT}{" "}
                                Lux Premium Cables
                            </div>
                            <div>
                                <div style={styles.summaryTopic}>
                                    You're Buying {USBCUSBC + USBCLGT} Lux
                                </div>
                                <div style={styles.summaryInfo}>
                                    <div>
                                        USB-C to USB-C{" "}
                                        <span style={styles.summaryinfoLeft}>
                                            ($37)
                                        </span>
                                    </div>
                                    <div style={styles.summaryinfoRight}>
                                        <div className="mr-10">{USBCUSBC}</div>
                                        <div>$
                                            {(
                                                USBCUSBC *
                                                products["usbCtoUsb"].variants
                                                    .edges[0].node.price
                                            ).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.summaryInfo}>
                                    <div>
                                        USB-C to Lightning{" "}
                                        <span style={styles.summaryinfoLeft}>
                                            ($37)
                                        </span>
                                    </div>
                                    <div style={styles.summaryinfoRight}>
                                        <div className="mr-10">{USBCLGT}</div>
                                        <div>$
                                            {(
                                                USBCLGT *
                                                products["usbCtoLightning"]
                                                    .variants.edges[0].node
                                                    .price
                                            ).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.summaryDesciption}>
                                    Purchased Lux cables include a complimentary
                                    Lux USB-A Adapter, Limited Lifetime Warranty
                                    and Premium Packaging.
                                </div>
                            </div>
                            <div>
                                <div style={styles.summaryTopic}>
                                    You're Getting{" "}
                                    {BONUSUSB + BONUSLGT} Bonus Lux
                                </div>
                                <div style={styles.summaryInfo}>
                                    <div>Complimentary Lux Cables</div>
                                    <div style={styles.summaryinfoRight}>
                                        <div className="mr-10">
                                            {BONUSUSB + BONUSLGT}
                                        </div>
                                        <div>FREE</div>
                                    </div>
                                </div>
                                <div style={styles.summaryDesciption}>
                                    FREE Lux cables offer Limited Lifetime
                                    Warranty Premium Packaging and Switch to
                                    Apple Lightning as options.
                                </div>
                            </div>
                            <div>
                                <div style={styles.summaryTopic}>
                                    Selected Upgrades & Extras
                                </div>
                                <div style={styles.summaryInfo}>
                                    <div>
                                        Switch to Lightning for Apple iOS{" "}
                                        <span style={styles.summaryinfoLeft}>
                                            ($5)
                                        </span>
                                    </div>
                                    <div style={styles.summaryinfoRight}>
                                        <div className="mr-10">{BONUSLGT}</div>
                                        <div>$
                                            {(
                                                BONUSLGT *
                                                products["switchToLightning"]
                                                    .variants.edges[0].node
                                                    .price
                                            ).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.summaryInfo}>
                                    <div>
                                        Upgrade to Lifetime Warranty & Premium
                                        Packaging{" "}
                                        <span style={styles.summaryinfoLeft}>
                                            ($7)
                                        </span>
                                    </div>
                                    <div style={styles.summaryinfoRight}>
                                        <div className="mr-10">
                                            {UPGRADE === true
                                                ? BONUSUSB + BONUSLGT
                                                : 0}
                                        </div>
                                        <div>$
                                            {UPGRADE === true
                                                ? (
                                                    (BONUSUSB + BONUSLGT) *
                                                    products[
                                                        "customGoldPlatedUsbAAdapter"
                                                    ].variants.edges[0].node
                                                        .price
                                                ).toFixed(2)
                                                : "0.00"}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.summaryInfo}>
                                    <div>
                                        USB-A Adapter 4-pack{" "}
                                        <span style={styles.summaryinfoLeft}>
                                            ($17)
                                        </span>
                                    </div>
                                    <div style={styles.summaryinfoRight}>
                                        <div className="mr-10">{ADUSBA}</div>
                                        <div>$
                                            {(
                                                ADUSBA *
                                                products["usbAAdapter4pack"]
                                                    .variants.edges[0].node
                                                    .price
                                            ).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.summaryInfo}>
                                    <div>
                                        Micro-USB Adapter 4-pack{" "}
                                        <span style={styles.summaryinfoLeft}>
                                            ($17)
                                        </span>
                                    </div>
                                    <div style={styles.summaryinfoRight}>
                                        <div className="mr-10">{ADMICRO}</div>
                                        <div>$
                                            {(
                                                ADMICRO *
                                                products["microUsbAdapter4pack"]
                                                    .variants.edges[0].node
                                                    .price
                                            ).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: "40px" }}></div>
                            <div style={styles.summaryInfo}>
                                <div>
                                    <strong>Total</strong>
                                </div>
                                <div>${totalPrice}</div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.bottomBtnGroup}>
                        <button
                            style={styles.bottomBtn}
                            onClick={() => setRoute(1)}
                        >
                            Back
                        </button>
                        <button
                            style={styles.bottomBtn}
                            onClick={() => clickCheckout()}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            ) : (
                ""
            )}

            {modalStatus && (
                <div style={styles.secondCardParent}>
                    <div style={styles.secondCard}>
                        <div style={styles.relative}>
                            <div style={styles.understoodHeaderTitle}>
                                What's Included
                            </div>
                            <div
                                style={styles.close}
                                onClick={() => setModalStatus(false)}
                            >
                                <CloseIcon />
                            </div>
                        </div>
                        <div style={styles.understoodBody}>
                            <div>
                                <table width="100%">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th style={styles.fontTH20}>
                                                Purchased Lux Cables
                                            </th>
                                            <th style={styles.fontTH20}>
                                                FREE Lux Cables
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td style={styles.font20}>
                                                Lifetime warranty
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Gorgeous Patent Pending Design
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Premium Silky Touch
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Certified to 25,000 Bends
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Kink-free technology
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Gold-Plated USB Connectors
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Charges 2X Faster Than Your
                                                Phone
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                24x7 Customer Care
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Fingerprint
                                                <span>TM</span> Anti-Counterfeit
                                                URL - lifetime 'Lost & Found'
                                                service
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Silicon cable tidy
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Generous <i>Ideal</i> 6ft/2m
                                                length
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Switch to Apple Lightning iPhone
                                                iOS
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.center}>$5</td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Premium packaging
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.center}>$?</td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Shipping, processing & handing
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.center}>$7</td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Gold-Plated USB-A adapter
                                            </td>
                                            <td style={styles.font30}>
                                                <CheckIcon />
                                            </td>
                                            <td style={styles.center}>
                                                4-pack <br /> $17
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.font20}>
                                                Gold-Plated Micro-USB adapter
                                            </td>
                                            <td
                                                style={styles.center}
                                                colSpan="2"
                                            >
                                                4-pack <br /> $17
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={styles.understoodButton}>
                                <button
                                    style={styles.included}
                                    onClick={() => setModalStatus(false)}
                                >
                                    Understood
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {infoStatus !== 0 && (
                <div style={styles.infoModal}>
                    <div style={styles.infoModalCard}>
                        <div style={styles.infoModalBody}>
                            <div style={styles.relative}>
                                <div style={styles.infoModalTitle}>
                                    Information
                                </div>
                                <div
                                    style={styles.close}
                                    onClick={() => setModalInfoStatus(0)}
                                >
                                    <CloseIcon />
                                </div>
                            </div>
                            <div style={styles.infoDetail}>
                                {infoStatus === 1 && (
                                    <div>
                                        This Lux cable type features a USB-C connector – the most recent type – at both ends. Easier to use and more powerful than previous versions, it can be used both to charge many popular devices – smartphones laptops, games consoles, cameras, headphones and so on, including the MacBook Pro, Nintendo Switch and Samsung Galaxy range of smartphones – and also to transfer data faster than any other USB type.
                                        <br /><br />
                                        USB-C is immediately recognisable because, unlike the older USB-A, it has an oval shape. It's completely symmetrical, and so it's impossible to insert incorrectly. Since this Lux cable type has a USB-C connector at both ends, it doesn’t matter which connector you use as an input and which as an output.
                                        <br /><br />
                                        In short, USB-C is far superior to other types of USB cable. As time goes on, more and more devices are likely to use the USB-C format, and so it's good to have some around.
                                    </div>
                                )}

                                {infoStatus === 2 && (
                                    <div>
                                        This Lux cable type, designed to be used with Apple iOS devices, features a USB-C connector as the input and an Apple MFi-certified Lightning connector as the output. MFi certification is important because it means that Apple has both supplied the connector tip and certified the design, thereby ensuring your cable meets the highest safety and quality standards, and will work flawlessly with your Apple Lightning devices – iPhones, iPads and iPods.
                                        <br /><br />
                                        The Lightning connector is symmetrical and so it can be inserted into a compatible Lightning port in either orientation, ie ‘face up’ or ‘face down’.
                                    </div>
                                )}

                                {infoStatus === 3 && (
                                    <div>
                                        The free Lux cables you receive from MAGFAST will be type USB-C to USB-C. However, you can choose to switch to our other Lux cable type – USB-C to Apple Lightning, suitable for iPhones, iPads and iPods – for the modest premium of just $5 per cable.
                                    </div>
                                )}

                                {infoStatus === 4 && (
                                    <div>
                                        <div>The free Lux cables you receive from MAGFAST will be type USB-C to USB-C type. For a modest cost of just $7 per cable, you can:</div>
                                        <ul>
                                            <li style={styles.mb5}>receive a custom, gold-plated USB-A adapter, so that this cable of the future will work perfectly with outlets and chargers of the past</li>
                                            <li style={styles.mb5}>take advantage of our lifetime ‘Lost & Found’ service – the unique URL printed on your cable ensures it can be swiftly identified and returned to you should it ever be lost</li>
                                            <li style={styles.mb5}>receive your Lux cable in premium packaging.</li>
                                        </ul>
                                    </div>
                                )}

                                {infoStatus === 5 && (
                                    <div>
                                        Lux cables are cables of the future … but you can ensure both our cable types – USB-C to USB-C and USB-C to Apple Lightning – will work perfectly with outlets and chargers of the past by buying our custom, gold-plated USB-A adapters, available as a 4-pack for just $17.
                                    </div>
                                )}

                                {infoStatus === 6 && (
                                    <div>
                                        Older phones and some modern devices – headphones, portable speakers, cameras and others – still use micro-USB to charge. You can ensure both our cable types – USB-C to USB-C and USB-C to Apple Lightning – will work perfectly with all those devices by buying our custom, gold-plated micro-USB adapters, available as a 4-pack for just $17.
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}