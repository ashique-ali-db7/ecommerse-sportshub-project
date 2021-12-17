


function formCategory(){
    var x = document.getElementById("categorychange").value;
  
$.ajax({
    url:'/admin/select-category-for-form?category='+x,
    method:'get',
    success:(response)=>{
        if(response){
       let arrayCounts = response.subcategory.length;
       var suboptions ;
      let arrayValues = response.subcategory; 
     
      var suboptions = "<option value='0'>select</option>";
      for(var i = 0; i<arrayCounts; i++){
        suboptions += "<option value='"+arrayValues[i]+"'>"+arrayValues[i]+"</option>"
      }
        document.getElementById('formsubcategory').innerHTML = suboptions;
        }
    }
})

}

// // preview add image
// function viewMainImageToAdd(event) {
   
  
//     document.getElementById('imageview1').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {

//         $('#imageview1').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }


// function viewSecondImageToAdd(event) {
   
//     document.getElementById('imageview2').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
//         $('#imageview2').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }


// function viewThirdImageToAdd(event) {
    
//     document.getElementById('imageview3').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
//         $('#imageview3').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }



// function viewFourthImageToAdd(event) {
   
//     document.getElementById('imageview4').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
//         $('#imageview4').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }




// preview crop validate add image

function fileValidation1() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file1');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file1');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview1').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}



function fileValidation2() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file2');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
       
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file2');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();
            
                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview2').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}







function fileValidation3() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file3');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file3');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview3').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}





function fileValidation4() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file4');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file4');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview4').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}





// preview edit image



// function viewMainImage(event) {

//     var fileInput = 
//     document.getElementById('image1');
  
// var filePath = fileInput.value;

// // Allowing file type
// var allowedExtensions = 
//         /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
// if (!allowedExtensions.exec(filePath)) {
//     alert('Invalid file type');
//     fileInput.value = '';
//     return false;
// } 
   
//     document.getElementById('editimageview1').classList.add("editimage");
//     document.getElementById('imageview1').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {

//         $('#imageview1').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }


// function viewSecondImage(event) {


//     var fileInput = 
//     document.getElementById('image2');
  
// var filePath = fileInput.value;

// // Allowing file type
// var allowedExtensions = 
//         /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
// if (!allowedExtensions.exec(filePath)) {
//     alert('Invalid file type');
//     fileInput.value = '';
//     return false;
// } 


    
//     document.getElementById('editimageview2').classList.add("editimage");
//     document.getElementById('imageview2').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
//         $('#imageview2').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }


// function viewThirdImage(event) {

//     var fileInput = 
//     document.getElementById('image3');
  
// var filePath = fileInput.value;

// // Allowing file type
// var allowedExtensions = 
//         /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
// if (!allowedExtensions.exec(filePath)) {
//     alert('Invalid file type');
//     fileInput.value = '';
//     return false;
// } 




//     document.getElementById('editimageview3').classList.add("editimage");
//     document.getElementById('imageview3').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
//         $('#imageview3').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }



// function viewFourthImage(event) {

//     var fileInput = 
//     document.getElementById('image4');
  
// var filePath = fileInput.value;

// // Allowing file type
// var allowedExtensions = 
//         /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
// if (!allowedExtensions.exec(filePath)) {
//     alert('Invalid file type');
//     fileInput.value = '';
//     return false;
// } 




//     document.getElementById('editimageview4').classList.add("editimage");
//     document.getElementById('imageview4').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
//         $('#imageview4').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }



function fileValidationedit1() {
  
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file1');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        document.getElementById('editimageview1').classList.add("editimage");
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file1');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview1').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}



function fileValidationedit2() {
  
    document.getElementById('editimageview2').classList.add("editimage");
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file2');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
       
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file2');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();
            
                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview2').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}







function fileValidationedit3() {
    document.getElementById('editimageview3').classList.add("editimage");
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file3');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file3');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview3').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}





function fileValidationedit4() {
    document.getElementById('editimageview4').classList.add("editimage");
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file4');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: true,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file4');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview4').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}




















//brand logo
// function viewLogoImage(event) {
    
//     document.getElementById('imagelogo').src = URL.createObjectURL(event.target.files[0])
//     let file = event.target.files[0].name
//     let extension = file.split('.').pop()
//     if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
//         $('#imagelogo').show()
//         $('#sub').show()
//         $('#errMsg').hide()

//     }
//     else {
//         $('#sub').hide()
//         $('#errMsg').show()
//     }
// }




function fileValidationbrand() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('file1');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
    
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('file1');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview1').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}











function fileValidationeditbrand() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('editfile1');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
    document.getElementById('editimageview1').classList.add("editimage");
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 16 / 19,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('editfile1');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('imgview1').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}


// subbanner file validation
function subbannerfileValidation1() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('subbannerfile1');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 23 / 12,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('subbannerfile1');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('subbannerimgview1').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}




function subbannerfileValidation2() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('subbannerfile2');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 23 / 12,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('subbannerfile2');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('subbannerimgview2').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}



function subbannerfileValidation3() {
    const imagebox = document.getElementById('image-box')
    const crop_btn = document.getElementById('crop-btn')
    var fileInput = document.getElementById('subbannerfile3');

var filePath = fileInput.value;

// Allowing file type
var allowedExtensions = 
        /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  
if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
} else {
        //Image preview
        const img_data = fileInput.files[0]
        const url = URL.createObjectURL(img_data)
        imagebox.innerHTML = `<img src="${url}" id="image" style="width:100%">`
        const image = document.getElementById('image')
        document.getElementById('image-box').style.display = 'block'
        document.getElementById('crop-btn').style.display = 'block'
        document.getElementById('confirm-btn').style.display = 'none'

        const cropper = new Cropper(image, {
            autoCropArea: 1,
            viewMode: 1,
            scalable: false,
            zoomable: false,
            movable: false,
            aspectRatio: 23 / 12,
            //  preview: '.preview',
            minCropBoxWidth: 180,
            minCropBoxHeight: 240,
        })
        crop_btn.addEventListener('click', () => {
            cropper.getCroppedCanvas().toBlob((blob) => {
                let fileInputElement = document.getElementById('subbannerfile3');
                let file = new File([blob], img_data.name, { type: "image/*", lastModified: new Date().getTime() });
                let container = new DataTransfer();

                container.items.add(file);
                const img = container.files[0]
                var url = URL.createObjectURL(img)
                fileInputElement.files = container.files;
                document.getElementById('subbannerimgview3').src = url
                document.getElementById('image-box').style.display = 'none'
                document.getElementById('crop-btn').style.display = 'none'
                document.getElementById('confirm-btn').style.display = 'block'
            });
        });
    }
}
//datatable

$(document).ready(function() {
    $('#brandtable').DataTable();
    $('#categorytable').DataTable();
    $('#producttable').DataTable();
    $('#usertable').DataTable();
    $('#ordermangementtable').DataTable();
   
    $('#productoffertable').DataTable();
    $('#categoryoffertable').DataTable();
    $('#coupenoffertable').DataTable();
 

  
} );















//modal
 function updateproductdetails(){
   
   document.getElementById("editproduct").submit();
   }

  function deletebrand(id){
     
    document.getElementById("deletebrand").href = "/admin/deletebrand?id="+id;
   
    document.getElementById("modal-body-id").innerHTML = "Are you sure do you want to delete";
  }

  function deletecategory(){
      document.getElementById("deletecategory").submit();
  }

  function deleteproducts(id,productname){
document.getElementById('deleteproductmodal').href = "/admin/deleteproduct?id="+id;
document.getElementById("modal-body-id").innerHTML = "Are you sure do you want to delete "+productname;

  }



 function blockuser(phonenumber,name){
    
     document.getElementById("updateUser").href = '/admin/blockuser?phonenumber='+phonenumber;
     document.getElementById("modal-body-id").innerHTML = "Are you sure do you want to block "+name;
 }

function unblockuser(phonenumber,name){
     document.getElementById("updateUser").href = '/admin/unblockuser?phonenumber='+phonenumber;
     document.getElementById("modal-body-id").innerHTML = "Are you sure do you want to unblock "+name;
}


//validatton

$("#addproducts").validate({
    rules:{
        productid:{
            required:true,
            number:true
        },
        productname:{
            required:true,
           
        },
        brand:{
            required:true,
            maxlength:14
        },
        category:{
            required:true,
          
        },
        
            firstprice:{
                required:true,
                number:true
            }
        ,
       
        subcategory:{
            required:true
        },
        smallquantity:{
            required:true,
            number:true
        },
        mediumquantity:{
            required:true,
            number:true
        },
        largequantity:{
            required:true,
            number:true
        },
        price:{
            required:true,
            number:true
        },
        description:{
            required:true,
          
        },
        image1:{
            required:true,
        },
        image2:{
            required:true,
        },
        image3:{
            required:true,
        },
        image4:{
            required:true,
        }
       
        
    }
   
  
});



$("#addcategory").validate({
    rules:{
       
        category:{
            required:true,
           
        },
      
        
    }
   
  
});

$("#subcategoryformvalidation").validate({
    rules:{
       
        subcategory:{
            required:true,
          
        },
      
        
    }
   
  
});


$("#brandvalidationform").validate({
    rules:{
       
        brandName:{
            required:true,
           
        },
        brandDescription:{
            required:true,
           
        },
        logo:{
            required:true
        }
       
        
    }
   
  
});


$("#editbrandvalidationform").validate({
    rules:{
       
        brandName:{
            required:true,
           
        },
        brandDescription:{
            required:true,
           
        },
       
        
    }
   
  
});



$("#categorybannerone").validate({
    rules:{
       
        subbannercategoryone:{
            required:true,
           
        },
        categorybannerimage1:{
            required:true,
           
        },
      
        
    }
   
  
});

$("#categorybannertwo").validate({
    rules:{
       
        subbannercategorytwo:{
            required:true,
           
        },
        categorybannerimage2:{
            required:true,
           
        },
      
        
    }
   
  
});

$("#categorybannerthree").validate({
    rules:{
       
        subbannercategorythree:{
            required:true,
           
        },
        categorybannerimage3:{
            required:true,
           
        },
      
        
    }
   
  
});

$("#homepageproductsone").validate({
    rules:{
       
        category:{
            required:true,
           
        },
        productbanner1image:{
            required:true,
           
        },
      
        
    }
   
  
});

$("#homepageproductstwo").validate({
    rules:{
       
        category:{
            required:true,
           
        },
        productbanner2image:{
            required:true,
           
        },
      
        
    }
   
  
});




$("#productoffer").validate({
    rules:{
       
        productname:{
            required:true,
           
        },
        discount:{
            required:true,
            number:true,
            max:100,
            min:1
           
        },
        profferstartdate:{
            required:true,
           
        },
        profferenddate:{
            required:true,
           
        }
        
    }
   
  
});


$("#coupenoffer").validate({
    rules:{
       
        coupencode:{
            required:true,
           
        },
        coupencount:{
            required:true,
            number:true,
            
           
        },
        coupenpercentage:{
            required:true,
            max:100,
            min:1
        },
        coupenstartdate:{
            required:true,
           
        },
        coupenenddate:{
            required:true,
           
        }
        
    }
   
  
});


$("#editproductoffer").validate({
    rules:{
       
        
        discountpercentageproduct:{
            required:true,
            number:true,
            max:100,
            min:1
           
        },
        profferstartdate:{
            required:true,
           
        },
        profferenddate:{
            required:true,
           
        }
        
    }
   
  
});



$("#categoryoffer").validate({
    rules:{
        category:{
            required:true,
           
        },
        
        discountpercentage:{
            required:true,
            number:true,
            max:100,
            min:1
           
        },
        caofferstartdate:{
            required:true,
           
        },
        caofferenddate:{
            required:true,
           
        }
        
    }
   
  
});



$("#editcategoryoffer").validate({
    rules:{
     
        
        discountpercentage:{
            required:true,
            number:true,
            max:100,
            min:1
           
        },
        caofferstartdate:{
            required:true,
           
        },
        caofferenddate:{
            required:true,
           
        }
        
    }
   
  
});



    $("#editproduct").validate({
        rules:{
           
            productid:{
                required:true,
                number:true
            },
            productname:{
                required:true,
              
            },
            brand:{
                required:true,
                maxlength:14
            },
            category:{
                required:true,
              
            },
           
            subcategory:{
                required:true
            },
            smallquantity:{
                required:true,
                number:true
            },
            mediumquantity:{
                required:true,
                number:true
            },
            largequantity:{
                required:true,
                number:true
            },
            price:{
                required:true,
                number:true
            },
            description:{
                required:true,
              
            },
            
        },
        submitHandler:
        function onsubmitForm(form){
          
            swal({
                title: "Are you sure?",
                text: "do you want to update this product?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
               form.submit();
                } 
              });
        }
       
      
    });
    
    $("#bannerone").validate({
        rules:{
           
            banner1heading:{
                required:true,
               maxlength:30
            },
            banner1description:{
                required:true,
               
            },
            banner1image:{
                required:true,

            }

          
            
        }
       
      
    });


    $("#bannertwo").validate({
        rules:{
           
            banner2heading:{
                required:true,
               maxlength:30
            },
            banner2description:{
                required:true,
               
            },
            banner2image:{
                required:true,
                
            }

          
            
        }
       
      
    });

// banner validation

    function BannerOneFileValidation() {
        var fileInput = 
            document.getElementById('banner1image');
          
        var filePath = fileInput.value;
      
        // Allowing file type
        var allowedExtensions = 
                /(\.jpg|\.jpeg|\.png|\.gif)$/i;
          
        if (!allowedExtensions.exec(filePath)) {
            alert('Invalid file type');
            fileInput.value = '';
            return false;
        } 
        else 
        {
          
            // Image preview 
            if (fileInput.files && fileInput.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById(
                        'imagePreviewBannerOne').innerHTML = 
                        '<img style="width:120px;height:120px" src="' + e.target.result
                        + '"/>';
                };
                  
                reader.readAsDataURL(fileInput.files[0]);
            }
        }
    }




    function BannerTwoFileValidation() {
        var fileInput = 
            document.getElementById('banner2image');
          
        var filePath = fileInput.value;
      
        // Allowing file type
        var allowedExtensions = 
                /(\.jpg|\.jpeg|\.png|\.gif)$/i;
          
        if (!allowedExtensions.exec(filePath)) {
            alert('Invalid file type');
            fileInput.value = '';
            return false;
        } 
        else 
        {
          
            // Image preview 
            if (fileInput.files && fileInput.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById(
                        'imagePreviewBannerTwo').innerHTML = 
                        '<img style="width:120px;height:120px" src="' + e.target.result
                        + '"/>';
                };
                  
                reader.readAsDataURL(fileInput.files[0]);
            }
        }
    }


//order status changing

 function orderstatus(orderid,orderstatus,proId,size){
   
 document.getElementById(proId+size).innerHTML = orderstatus;
  document.getElementById(proId+size+"sp").textContent = orderstatus;


     $.ajax({

      url:'/admin/changeorderstatus?orderid='+orderid+'&orderstatus='+orderstatus+'&proId='+proId+'&size='+size,
      method:'get',
      success:(response)=>{
   if(response){
       if(orderstatus === 'delivered' || orderstatus === 'canceled'){
   location.reload();
       }

   }
      }

     })
 }

//product banner validation

function productBannerOneFileValidation() {
    var fileInput = 
        document.getElementById('productbanner1image');
      
    var filePath = fileInput.value;
  
    // Allowing file type
    var allowedExtensions = 
            /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        fileInput.value = '';
        return false;
    } 
    else 
    {
      
        // Image preview 
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(
                    'imagePreviewproductBannerOne').innerHTML = 
                    '<img style="width:120px;height:120px" src="' + e.target.result
                    + '"/>';
            };
              
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
}



function productBannerTwoFileValidation() {
    var fileInput = 
        document.getElementById('productbanner2image');
      
    var filePath = fileInput.value;
  
    // Allowing file type
    var allowedExtensions = 
            /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        fileInput.value = '';
        return false;
    } 
    else 
    {
      
        // Image preview 
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(
                    'imagePreviewproductBannerTwo').innerHTML = 
                    '<img style="width:120px;height:120px" src="' + e.target.result
                    + '"/>';
            };
              
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
}


function categoryOfferEdit(id){
   
    $.ajax({
        url:'/admin/categoryoffereditdata?categoryofferid='+id,
        method:'get',
        success:(response)=>{
            if(response){
document.getElementById('discountedit').value = response.discountpercentage;
document.getElementById('disabledoption').innerHTML = response.category;
document.getElementById('hiddencategory').value = response.category;
document.getElementById('startdateedit').value  = response.caofferstartdate;
document.getElementById('enddateedit').value  = response.caofferenddate;

            }else{

            }
        }

    })
}





function couponOfferEdit(id){
   
    $.ajax({
        url:'/admin/coupenoffereditdata?coupenofferid='+id,
        method:'get',
        success:(response)=>{
            if(response){
document.getElementById('coupondiscountedit').value = response.coupenpercentage;
document.getElementById('coupondisabledoption').innerHTML = response.coupencode;
document.getElementById('couponhiddencode').value = response.coupencode;
document.getElementById('couponstartdateedit').value  = response.coupenstartdate;
document.getElementById('couponenddateedit').value  = response.coupenenddate;

            }else{

            }
        }

    })
}

function deletecategoryoffer(category,offerpercentage){
     
    swal("Are you sure you want to remove "+category+" offer ?", {
        buttons: true,
      }).then((willdelete)=>{
if(willdelete){
    
 

    $.ajax({
        url:'/admin/deletecategoryoffer?category='+category+"&percentage="+offerpercentage,
      
        method:'get',
        success:(response)=>{
         if(response.status){
             location.reload();
         }
        }
    })
}else{

}
      })
}

function productOfferEdit(id){
    $.ajax({
        url:'/admin/productOfferEdit?id='+id,
        method:'get',
        success:(response)=>{

            document.getElementById('discounteditproduct').value = response.discount;
            document.getElementById('h4product').innerHTML = response.productname;
            document.getElementById('hiddenproductname').value = response.productname;
            document.getElementById('startdateeditproduct').value  = response.profferstartdate;
            document.getElementById('enddateeditproduct').value  = response.profferenddate;



        }
    })
}

function deleteproductoffer(productname){

    swal("Are you sure you want to remove "+productname+" offer ?", {
        buttons: true,
      }).then((willdelete)=>{
if(willdelete){
    
 

    $.ajax({
        url:'/admin/deleteproductoffer?productname='+productname,
      
        method:'get',
        success:(response)=>{
         if(response.status){
             location.reload();
         }
        }
    })
}else{

}
      })


}

function deletecoupenoffer(coupencode){
   
    swal("Are you sure you want to remove "+coupencode+"?", {
        buttons: true,
      }).then((willdelete)=>{
if(willdelete){

    $.ajax({
        url:'/admin/deletecoupenoffer?coupencode='+coupencode,
        method:'get',
        success:(response)=>{
    if(response.status){
location.reload();
    }else{

    }
        }
    })

}else{

}
      })

}



// $(document).ready(function(){

//     $.ajax({
//         url:'/admin/chartdata',
//         method:'get',
//         success:(response)=>{


//             const paymentcounts = [];
//      response.paymentCount.map((eachpayment)=>{
// let count = eachpayment.count
// paymentcounts.push(count);
//      });

//      const dateForDailiySales = [];
//      const countOfDailySales = [];

//       response.dailysalescount.map((eachDay)=>{
// let date = eachDay._id;

// let countfordailysale = eachDay.total;

// dateForDailiySales.push(date);

// countOfDailySales.push(countfordailysale);
//      })
// const category = [];
// const categorycount = [];
//       response.categorysalescount.map((eachcategory)=>{
//          let categoryname = eachcategory._id;
//          let categorysalecounts = eachcategory.count;
         
//          category.push(categoryname);
//          categorycount.push(categorysalecounts)
//      })

     
      

//             const ctx1 = document.getElementById('myChart1').getContext('2d');
//             const myChart1 = new Chart(ctx1, {
//                 type: 'bar',
//                 data: {
//                     labels: ['Delivered', 'Placed', 'Pending', 'Canceled'],
//                     datasets: [{
//                         label: 'Order Status',
//                         data: response.orderstatus,
//                     backgroundColor: [
//                         'rgb(145, 22, 201)',
                      
//                     ],
                   
//                 }]
//             },
//                 options: {
                 
                  
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 },
               
//             }
//             });



// const ctx11 = document.getElementById('myChart11').getContext('2d');
// const myChart11 = new Chart(ctx11, {
//     type: 'bar',
//     data: {
//         labels: dateForDailiySales,
//         datasets: [{
//             label: 'Daily sales',
//             data: countOfDailySales,
//             backgroundColor: [
//                 'rgb(218, 49, 11)',
              
//             ],
//     }]
// },
//     options: {
      
//     scales: {
//         y: {
//             beginAtZero: true
//         }
//     },
   
// }
// });








// const ctx2 = document.getElementById('myChart2').getContext('2d');
// const myChart2 = new Chart(ctx2, {
//     type: 'doughnut',
//     data: {
//         labels: ['COD', 'Paypal', 'Razorpay'],
//         datasets: [{
//             label: 'Payment Methods',
//             data: paymentcounts,
//         backgroundColor: [
//             'rgb(145, 22, 201)',
//             'rgb(201, 22, 169)',
//             'rgb(201, 55, 22)',
//             'rgb(22, 201, 201)',
//             'rgb(201, 201, 22)',
//             'rgb(123, 123, 100)'
//         ],
//         borderColor: [
//             'rgba(255, 99, 132, 1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(75, 192, 192, 1)',
//             'rgba(153, 102, 255, 1)',
//             'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 1
//     }]
// },
//     options: {
   
// }
// });
// const ctx3 = document.getElementById('myChart3').getContext('2d');
// const myChart3 = new Chart(ctx3, {
//     type: 'doughnut',
//     data: {
//         labels: category,
//         datasets: [{
//             label: 'Payment Methods',
//             data: categorycount,
//         backgroundColor: [
//             'rgb(201, 55, 22)',
//             'rgb(22, 201, 201)',
//             'rgb(201, 201, 22)',
//             'rgb(123, 123, 100)',
//             'rgb(145, 22, 201)',
//             'rgb(201, 22, 169)',
            
           
           
//         ],
//         borderColor: [
//             'rgba(255, 99, 132, 1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(75, 192, 192, 1)',
//             'rgba(153, 102, 255, 1)',
//             'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 1
//     }]
// },
//     options: {
 
// }
// });
// const ctx4 = document.getElementById('myChart4').getContext('2d');
// const myChart4 = new Chart(ctx4, {
//     type: 'doughnut',
//     data: {
//         labels: ['COD', 'Razorpay', 'Paypal'],
//         datasets: [{
//             label: 'Payment Methods',
//             data: [1,2,3],
//         backgroundColor: [
//             'rgba(255, 99, 132, 0.2)',
//             'rgba(54, 162, 235, 0.2)',
//             'rgba(255, 206, 86, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(153, 102, 255, 0.2)',
//             'rgba(255, 159, 64, 0.2)'
//         ],
//         borderColor: [
//             'rgba(255, 99, 132, 1)',
//             'rgba(54, 162, 235, 1)',
//             'rgba(255, 206, 86, 1)',
//             'rgba(75, 192, 192, 1)',
//             'rgba(153, 102, 255, 1)',
//             'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 1
//     }]
// },
//     options: {

// }
// });
//         }
//     })
    


    
//         }) 
    
    


$(document).ready(function() {
    $('#example').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
} );




function dailysalesreport(){

    let startDate = document.getElementById('salesReportStartDate').value;
   let endDate = document.getElementById('salesReportEndDate').value;
 
  

      $.ajax({
           url:'/admin/getreport?startDate='+startDate+"&endDate="+endDate,
            method:'get',
            success:(response)=>{
if(response.status){
    location.href='/admin/report';
}
            }
       })
}


   
    $('#categorytable tbody tr').each(function(idx){
     
        $(this).children("td:eq(0)").html(idx+1)
    })

    


    $('#brandtable tbody tr').each(function(idx){
     
        $(this).children("td:eq(0)").html(idx+1)
    })

    $(function() {
       
          $(document).ready(function () {
    
             
     
           var todaysDate = new Date(); // Gets today's date

             
      
            // Max date attribute is in "YYYY-MM-DD".  Need to format today's date accordingly
   
             
    
            var year = todaysDate.getFullYear();                        // YYYY
     
            var month = ("0" + (todaysDate.getMonth() + 1)).slice(-2);  // MM
      
            var day = ("0" + todaysDate.getDate()).slice(-2);           // DD
       
         
   
            var minDate = (year +"-"+ month +"-"+ day); // Results in "YYYY-MM-DD" for today's date 
            var maxDate = (year +"-"+ month +"-"+ day);
             
      
            // Now to set the max date value for the calendar to be today's date
       
            $('#llll').attr('min',minDate);
            $('#mmmm').attr('min',minDate);
            
            $('#bbbb').attr('min',minDate);
            $('#cccc').attr('min',minDate);
            
            
            $('#couponstartdateedit').attr('min',minDate);
            $('#couponenddateedit').attr('min',minDate);
            
            $('#salesReportStartDate').attr('max',maxDate);
            $('#salesReportEndDate').attr('max',maxDate);
            $('#birthday1').attr('min',minDate);
            $('#birthday2').attr('min',minDate);
          });
        
        });
        

     