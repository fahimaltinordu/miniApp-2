const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://mini-app-2.vercel.app/tonconnect-manifest.json',
});

tonConnectUI.uiOptions = {
    twaReturnUrl: 'https://t.me/EnergyFi_testApp_bot', //To redirect user to a Telegram Mini App after wallet connection
};

function connectAct() {
    document.getElementById("connectWallet").style.display = "none";
    document.getElementById("tonAddress").style.display = "block";
}
function disconnectAct() {
    document.getElementById("connectWallet").style.display = "block";
    document.getElementById("tonAddress").style.display = "none";
}
if (getWalletStatus() === 1) {
    connectAct();
} else if (getWalletStatus() === 0) {
    disconnectAct();
}

setAddress(getAddress());
setWalletStatus(getWalletStatus());


function getAddress() {
    const address = localStorage.getItem('address');
    return address === null ? "no address" : address;
}
function setAddress(address) {
    localStorage.setItem('address', address);
    document.getElementById("tonAddress").textContent = sliceAddress(getAddress(), 3, 3);
}
function getWalletStatus() {
    const status = localStorage.getItem('status');
    return status === null ? 0 : Number(status);
}
function setWalletStatus(status) {
    localStorage.setItem('status', status);
}
function sliceAddress(address, num1 = 4, num2 = 5) {
    if (!address) {
        return ''
    }
    return address.substr(0, num1) + '***' + address.substring(address.length - num2)
};
function trsAddress(address) {
    let addr = TonConnectSDK.toUserFriendlyAddress(address);
    return addr;
}
async function connectWallet() {
    const connectedWallet = await tonConnectUI.connectWallet();
    currentIsConnectedStatus = tonConnectUI.connected;

    let fetchedRawAddress = connectedWallet.account.address;
    setAddress(trsAddress(fetchedRawAddress));

    setWalletStatus(1);

    connectAct();
    document.getElementById("tonAddress").textContent = sliceAddress(getAddress(), 3, 3);

    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: "success",
        title: "Connected",
    });
    return currentIsConnectedStatus;
}

document.getElementById("tonAddress").onclick = async () => {

    Swal.fire({
        html: `${getAddress()}`,
        showDenyButton: true,
        confirmButtonText: "Disconnect",
        denyButtonText: `Copy`
    }).then(async (result) => {
        if (result.isConfirmed) {
            await tonConnectUI.disconnect();
            currentIsConnectedStatus = tonConnectUI.connected;
            disconnectAct();
            setWalletStatus(0);
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: "success",
                title: "Disconnected",
            });
        } else if (result.isDenied) {
            try {
                await navigator.clipboard.writeText(getAddress());
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    icon: "success",
                    title: "Copied to clipboard",
                });
            } catch (err) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    icon: "error",
                    title: `Failed to copy:, ${err}`,
                });
            }
        }
    });

}