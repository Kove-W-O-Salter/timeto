onmessage = (event) => {
    if(event.data === "start") {
        console.log("Timeout Worker: Received 'start' event!");
        setTimeout(() => {
            console.log("Timeout Worker: Sending 'update' event!");
            postMessage("update");
        }, 100);
    }
};