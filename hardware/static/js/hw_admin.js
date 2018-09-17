
let hw_admin = ((hw)=>{
    if(!hw){
        console.error("hw.js has to be declared before hw_admin.js")
        return;  
    } 
    let obj = {}
    let cams = []

    obj.initTypeaheads = ()=>{
        if($("#id-email"))
            $("#id-email").typeahead({
                hint:true,
                highlight:true,
                minLength:1
            },{
                displayKey:'email',
                async:true,
                source: hw.debounce((query, a,b)=>{
                    hw.ajax_req({
                        identify_hacker:true,
                        query:query
                    }, (data)=>{
                        let pd = JSON.parse(data)
                        let filtered = pd.map(x => x.fields)
                        b(filtered)
                    })
                }, 500),
                templates:{
                    suggestion:function(data){
                        return "<div>"+ data.name + " ("+data.email+")</div>"
                    }
                }
            });
    }

    obj.initScanner = ()=>{
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                cams = cameras
                console.log(cams)
            } else {
                console.error('No cameras found.');
            }
        }).catch(function (e) {
            console.error(e);
        });
    }
    //-Updates the content
    //-Shows a toast if there's a message
    obj.processResponse = (data)=>{
        if(data.msg) 
            hw.toast(data.msg)
        
        if(data.content){
            $('#hw-container').fadeTo(200, 0, ()=>{
                $('#hw-container').html(data.content)
                obj.initListeners()
                obj.initTypeaheads()
                $('#hw-container').fadeTo(200, 1)
            })
        }
    }


    obj.initListeners = ()=>{
        $(".hw-back").on("click", ()=>{
            hw.ajax_req({
                'back': true
            }, obj.processResponse)
        })
        $("#hw-user-send").on("click", ()=>{
            hw.ajax_req({
                'get_lists': true,
                'email': $("#id-email").val()
            }, obj.processResponse)
        })
        $("#hw-user-send-noreq").on("click", (ev)=>{
            hw.ajax_req({
                'get_user_noreq': true,
                'email': $("#id-email").val(),
                'item_id': ev.currentTarget.dataset.itemId
            }, obj.processResponse)
        })
        $("#hw-requests-list li").on("click", (ev)=>{
            hw.ajax_req({
                'select_request': true,
                'request_id': ev.currentTarget.dataset.requestId
            }, obj.processResponse)
        })
        $("#hw-lendings-list li").on("click", (ev)=>{
            hw.ajax_req({
                'return_item': true,
                'lending_id': ev.currentTarget.dataset.lendingId
            }, obj.processResponse)
        })
        $("#hw-available-items-list li").on("click", (ev)=>{
            hw.ajax_req({
                'make_lending': true,
                'item_id': ev.currentTarget.dataset.itemId,
                'request_id': ev.currentTarget.parentNode.dataset.requestId
            }, obj.processResponse)
        })
        /* Admin no request hardware type element */
        $("#hw-type-noreq li").on("click", (ev)=>{
            hw.ajax_req({
                'select_type_noreq': true,
                'type_id': ev.currentTarget.dataset.typeId
            }, obj.processResponse)
        })
        $("#hw-available-items-list-noreq li").on("click", (ev)=>{
            hw.ajax_req({
                'select_item_noreq': true,
                'item_id': ev.currentTarget.dataset.itemId
            }, obj.processResponse)
        })
        $("#hw-qr-btn").on("click", (ev)=>{
            obj.qrScan($("#id-email")[0])
        })
    }

    //Opens a popup with a camera preview. If a QR is detected,
    //it's value is set into 'inputElem'. 
    //Clicking the bg cancels the operation
    //pre: call initScanner
    obj.qrScan = (inputElem)=>{
        if(!cams) console.error("I can't scan without a camera")
        if(!localStorage.getItem("selectedCam"))
            localStorage.setItem("selectedCam", 0)

        let selectedCam = parseInt(localStorage.getItem("selectedCam"))
        //Create video element for camera output
        let videoElem = document.createElement('video')
        //Create element to darken the rest of the page
        let veil = document.createElement("div")
        //Init scanner with this element
        let scanner = new Instascan.Scanner({ video: videoElem });
        //Once we scan a value, set the inputElem to this value and close the popup
        scanner.addListener('scan', function (content) {
            console.info("Read QR content: "+content)
            inputElem.value = content
            scanner.stop()
            popup.parentNode.removeChild(popup)
            veil.parentNode.removeChild(veil)
            popup = ""
        });
        //Creating the popup
        let popup = document.createElement("div")
        popup.classList.add("hw-popup-scan")
        //Append camera selector
        let selectCam = document.createElement("select")
        let optionsStr=""
        for(let i =0; i < cams.length; i++)
            optionsStr += "<option value='"+i+"'>" + (cams[i].name || "Cam"+i) + "</option>"
        selectCam.innerHTML=optionsStr
        popup.appendChild(selectCam)
        selectCam.value = ""+selectedCam
        //On selector change, we stop the scanner preview and change the camera
        selectCam.addEventListener("change", ()=>{
            let selectedCam = parseInt(this.value)
            localStorage.setItem("selectedCam", selectedCam)
            scanner.stop()
            scanner.start(cams[seletedCam])
        })
        //Then we append the video preview
        popup.appendChild(videoElem)
        //Append popup to document
        document.body.appendChild(popup)
        //Darken the rest of the page
        document.body.appendChild(veil)
        veil.classList.add('veil')
        //On click on the bg, cancel the operation
        veil.addEventListener("click", ()=>{
            if(popup){
                scanner.stop()
                popup.parentNode.removeChild(popup)
                veil.parentNode.removeChild(veil)
                popup = ""
            }
        })
        
        //Start the scanner with the stored value
        scanner.start(cams[selectedCam])
        
    }
    
    return obj
})(hw)

document.addEventListener("DOMContentLoaded", ()=>{
    hw_admin.initListeners()
    hw_admin.initTypeaheads()
    hw_admin.initScanner()
})