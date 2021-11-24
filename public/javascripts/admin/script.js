

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
      console.log(arrayValues);
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

//datatable

$(document).ready(function() {
    $('#brandtable').DataTable();
} );


$(document).ready(function() {
    $('#categorytable').DataTable();
} );


$(document).ready(function() {
    $('#producttable').DataTable();
} );

$(document).ready(function() {
    $('#usertable').DataTable();
} );

$(document).ready(function() {
    $('#ordermange').DataTable();
} );

//modal
 function updateproductdetails(){
     console.log("monnee")
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
            maxlength:10
        },
        brandDescription:{
            required:true,
           
        },
        logo:{
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
               maxlength:20
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
               maxlength:20
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

function orderstatus(orderid,orderstatus){
document.getElementById(orderid).innerHTML = orderstatus;

    $.ajax({

     url:'/admin/changeorderstatus?orderid='+orderid+'&orderstatus='+orderstatus,
     method:'get',
     success:(response)=>{
  if(response){

  }
     }

    })
}





