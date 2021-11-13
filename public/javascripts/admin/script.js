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



// preview image



function viewMainImage(event) {
    document.getElementById('editimageview1').classList.add("editimage");
    document.getElementById('imageview1').src = URL.createObjectURL(event.target.files[0])
    let file = event.target.files[0].name
    let extension = file.split('.').pop()
    if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {

        $('#imageview1').show()
        $('#sub').show()
        $('#errMsg').hide()

    }
    else {
        $('#sub').hide()
        $('#errMsg').show()
    }
}


function viewSecondImage(event) {
    document.getElementById('editimageview2').classList.add("editimage");
    document.getElementById('imageview2').src = URL.createObjectURL(event.target.files[0])
    let file = event.target.files[0].name
    let extension = file.split('.').pop()
    if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
        $('#imageview2').show()
        $('#sub').show()
        $('#errMsg').hide()

    }
    else {
        $('#sub').hide()
        $('#errMsg').show()
    }
}


function viewThirdImage(event) {
    document.getElementById('editimageview3').classList.add("editimage");
    document.getElementById('imageview3').src = URL.createObjectURL(event.target.files[0])
    let file = event.target.files[0].name
    let extension = file.split('.').pop()
    if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
        $('#imageview3').show()
        $('#sub').show()
        $('#errMsg').hide()

    }
    else {
        $('#sub').hide()
        $('#errMsg').show()
    }
}



function viewFourthImage(event) {
    document.getElementById('editimageview4').classList.add("editimage");
    document.getElementById('imageview4').src = URL.createObjectURL(event.target.files[0])
    let file = event.target.files[0].name
    let extension = file.split('.').pop()
    if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
        $('#imageview4').show()
        $('#sub').show()
        $('#errMsg').hide()

    }
    else {
        $('#sub').hide()
        $('#errMsg').show()
    }
}

//brand logo
function viewLogoImage(event) {
    
    document.getElementById('imagelogo').src = URL.createObjectURL(event.target.files[0])
    let file = event.target.files[0].name
    let extension = file.split('.').pop()
    if (extension == 'jpeg' || extension == 'png' || extension == 'jpg') {
        $('#imagelogo').show()
        $('#sub').show()
        $('#errMsg').hide()

    }
    else {
        $('#sub').hide()
        $('#errMsg').show()
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


//modal
function updateproductdetails(){
    console.log("monnee")
  document.getElementById("editproduct").submit();
  }

//validatton