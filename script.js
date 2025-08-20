// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    let prompt = document.querySelector("#prompt");
    let submitbtn = document.querySelector("#submit");
    let chatContainer = document.querySelector(".chat-container");
    let imagebtn=document.querySelector("#image")
    let image=document.querySelector("#image img")
    let imageinput=document.querySelector("#image input")

    const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAsyhpOl4e4duTrd5VbKKYDvQnfkdE8OXc"
    let user={
        message:null,
        file:{
            mime_type: null,
            data: null
        }

    }

    async function generateResponse(aiChatBox) {
        let text=aiChatBox.querySelector(".ai-chat-area")

        let RequestOption={
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({
               "contents": [
                   {"parts": [{"text": user.message},(user.file.data?[{"inline_data":user.file}]:[])
                   ]
                }]
            })
        }
        try{
            let response=await fetch(Api_Url,RequestOption)
            let data=await response.json()
            let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
            text.innerHTML=apiResponse
        
    
    }
    catch(error){
        console.log(error);
    
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})  
        image.src= `img.svg`
        image.classList.remove("choose") 
        user.file={}
    }


    }
    
    /*// Check if elements exist
    if (!prompt) {
        console.error("Element with ID 'prompt' not found!");
        return;
    }
    
    if (!chatContainer) {
        console.error("Element with class 'chat-container' not found!");
        return;
    }*/

    function createChatBox(html, classes) {
        let div = document.createElement("div")
        div.innerHTML = html
        div.classList.add(classes)
        return div
    }

    function handleChatResponse(usermessage) {
        user.message=usermessage 
        
        //if (!message.trim()) {
          //  return;
        //}
        
        let html = `<img src="user.png" alt="" id="userImage" width="8%">
        <div class="user-chat-area">
        ${user.message}
        ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
        </div>`
        prompt.value = ""
        let userChatBox = createChatBox(html, "user-chat-box")
        chatContainer.appendChild(userChatBox)

        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        
       
        
        
        setTimeout(() => {
            let aiHtml = `<img src="ai.jpg" alt="" id="aiImage" width="10%">
            <div class="ai-chat-area">
            <img src="07-57-40-974_512.gif" alt="" class="load" width="50px">
            
            </div>`
            let aiChatBox = createChatBox(aiHtml, "ai-chat-box")
            chatContainer.appendChild(aiChatBox)
            generateResponse(aiChatBox)
            
            
            chatContainer.scrollTop = chatContainer.scrollHeight
        }, 600)
    }

    // Add event listener for Enter key
    prompt.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleChatResponse(prompt.value);
        }
    });

    submitbtn.addEventListener("click",()=>{
        handleChatResponse(prompt.value)
    })

    imageinput.addEventListener("change",()=>{
        const file=imageinput.files[0]
        if(!file) return 
        let reader=new FileReader()
        reader.onload=(e)=>{
            let base64string=e.target.result.split(",")[1]
            user.file={
              mime_type: file.type,
              data: base64string
        }
        image.src= `data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
        }
        
        reader.readAsDataURL(file)
    })


    imagebtn.addEventListener("click",()=>{
          imagebtn.querySelector("input").click()
    })
    
    console.log("Chatbot initialized successfully!");
});



