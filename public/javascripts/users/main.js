/*  ---------------------------------------------------
    Template Name: Fashi
    Description: Fashi eCommerce HTML Template
    Author: Colorlib
    Author URI: https://colorlib.com/
    Version: 1.0
    Created: Colorlib
---------------------------------------------------------  */

"use strict";

//   const Toast = Swal.mixin({
//      toast: true,
//      position: 'top-end',
//      showConfirmButton: false,
//      timer: 3000,
//      timerProgressBar: true,
//      didOpen: (toast) => {
//        toast.addEventListener('mouseenter', Swal.stopTimer)
//        toast.addEventListener('mouseleave', Swal.resumeTimer)
//      }
//    })

// verifuacation

(function ($) {
  /*------------------
        Preloader
    --------------------*/
  $(window).on("load", function () {
    $(".loader").fadeOut();
    $("#preloder").delay(200).fadeOut("slow");
  });

  /*------------------
        Background Set
    --------------------*/
  $(".set-bg").each(function () {
    var bg = $(this).data("setbg");
    $(this).css("background-image", "url(" + bg + ")");
  });

  /*------------------
		Navigation
	--------------------*/
  $(".mobile-menu").slicknav({
    prependTo: "#mobile-menu-wrap",
    allowParentLinks: true,
  });

  /*------------------
        Hero Slider
    --------------------*/
  $(".hero-items").owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    items: 1,
    dots: false,
    animateOut: "fadeOut",
    animateIn: "fadeIn",
    navText: [
      '<i class="ti-angle-left"></i>',
      '<i class="ti-angle-right"></i>',
    ],
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: true,
  });

  /*------------------
        Product Slider
    --------------------*/
  $(".product-slider").owlCarousel({
    loop: true,
    margin: 25,
    nav: true,
    items: 4,
    dots: true,
    navText: [
      '<i class="ti-angle-left"></i>',
      '<i class="ti-angle-right"></i>',
    ],
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 2,
      },
      992: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  });

  /*------------------
       logo Carousel
    --------------------*/
  $(".logo-carousel").owlCarousel({
    loop: false,
    margin: 30,
    nav: false,
    items: 5,
    dots: false,
    navText: [
      '<i class="ti-angle-left"></i>',
      '<i class="ti-angle-right"></i>',
    ],
    smartSpeed: 1200,
    autoHeight: false,
    mouseDrag: false,
    autoplay: true,
    responsive: {
      0: {
        items: 3,
      },
      768: {
        items: 5,
      },
    },
  });

  /*-----------------------
       Product Single Slider
    -------------------------*/
  $(".ps-slider").owlCarousel({
    loop: false,
    margin: 10,
    nav: true,
    items: 3,
    dots: false,
    navText: [
      '<i class="fa fa-angle-left"></i>',
      '<i class="fa fa-angle-right"></i>',
    ],
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: true,
  });

  /*------------------
        CountDown
    --------------------*/
  // For demo preview
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  if (mm == 12) {
    mm = "01";
    yyyy = yyyy + 1;
  } else {
    mm = parseInt(mm) + 1;
    mm = String(mm).padStart(2, "0");
  }
  var timerdate = mm + "/" + dd + "/" + yyyy;
  // For demo preview end

  // Use this for real timer date
  /* var timerdate = "2020/01/01"; */

  $("#countdown").countdown(timerdate, function (event) {
    $(this).html(
      event.strftime(
        "<div class='cd-item'><span>%D</span> <p>Days</p> </div>" +
          "<div class='cd-item'><span>%H</span> <p>Hrs</p> </div>" +
          "<div class='cd-item'><span>%M</span> <p>Mins</p> </div>" +
          "<div class='cd-item'><span>%S</span> <p>Secs</p> </div>"
      )
    );
  });

  /*----------------------------------------------------
     Language Flag js 
    ----------------------------------------------------*/
  $(document).ready(function (e) {
    //no use
    try {
      var pages = $("#pages")
        .msDropdown({
          on: {
            change: function (data, ui) {
              var val = data.value;
              if (val != "") window.location = val;
            },
          },
        })
        .data("dd");

      var pagename = document.location.pathname.toString();
      pagename = pagename.split("/");
      pages.setIndexByValue(pagename[pagename.length - 1]);
      $("#ver").html(msBeautify.version.msDropdown);
    } catch (e) {
      // console.log(e);
    }
    $("#ver").html(msBeautify.version.msDropdown);

    //convert
    $(".language_drop").msDropdown({ roundedBorder: false });
    $("#tech").data("dd");
  });
  /*-------------------
		Range Slider
	--------------------- */
  var rangeSlider = $(".price-range"),
    minamount = $("#minamount"),
    maxamount = $("#maxamount"),
    minPrice = rangeSlider.data("min"),
    maxPrice = rangeSlider.data("max");
  rangeSlider.slider({
    range: true,
    min: minPrice,
    max: maxPrice,
    values: [minPrice, maxPrice],
    slide: function (event, ui) {
      minamount.val("$" + ui.values[0]);
      maxamount.val("$" + ui.values[1]);
    },
  });
  minamount.val("$" + rangeSlider.slider("values", 0));
  maxamount.val("$" + rangeSlider.slider("values", 1));

  /*-------------------
		Radio Btn
	--------------------- */
  $(".fw-size-choose .sc-item label, .pd-size-choose .sc-item label").on(
    "click",
    function () {
      $(
        ".fw-size-choose .sc-item label, .pd-size-choose .sc-item label"
      ).removeClass("active");
      $(this).addClass("active");
    }
  );

  /*-------------------
		Nice Select
    --------------------- */
  $(".sorting, .p-show").niceSelect();

  /*------------------
		Single Product
	--------------------*/
  $(".product-thumbs-track .pt").on("click", function () {
    $(".product-thumbs-track .pt").removeClass("active");
    $(this).addClass("active");
    var imgurl = $(this).data("imgbigurl");
    var bigImg = $(".product-big-img").attr("src");
    if (imgurl != bigImg) {
      $(".product-big-img").attr({ src: imgurl });
      $(".zoomImg").attr({ src: imgurl });
    }
  });

  $(".product-pic-zoom").zoom();

  /*-------------------
		Quantity change
	--------------------- */
  var proQty = $(".pro-qty");
  proQty.prepend('<span class="dec qtybtn">-</span>');
  proQty.append('<span class="inc qtybtn">+</span>');
  proQty.on("click", ".qtybtn", function () {
    var $button = $(this);
    var oldValue = $button.parent().find("input").val();
    if ($button.hasClass("inc")) {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      // Don't allow decrementing below zero
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 0;
      }
    }
    $button.parent().find("input").val(newVal);
  });
})(jQuery);

// validation

$("#register-form").validate({
  rules: {
    emailaddress: {
      required: true,
      email: true,
    },
    password: {
      required: true,
      minlength: 8,
    },
    name: {
      required: true,
    },
    phonenumber: {
      required: true,
      minlength: 10,
      maxlength: 10,
      number: true,
    },

    confirmpassword: {
      required: true,
    },
  },
  messages: {
    password: {
      required: "Password is required",
    },
  },
});

$("#userlogin").validate({
  rules: {
    emailaddress: {
      required: true,
      email: true,
    },
    password: {
      required: true,
    },
  },
});

$("#profiledit").validate({
  rules: {
    email: {
      required: true,
      email: true,
    },
    fullname: {
      required: true,
    },
    mobilenumber: {
      required: true,
      number: true,
      maxlength: 10,
      minlength: 10,
    },
    country: {
      required: true,
    },
    state: {
      required: true,
    },
    location: {
      required: true,
    },
  },
});

$("#phonenumberpage").validate({
  rules: {
    number: {
      required: true,
      maxlength: 10,
      minlength: 10,
    },
  },
});

$("#profleedit").validate({
  rules: {
    fullname: {
      required: true,
    },
    email: {
      required: true,
      email: true,
    },
    mobilenumber: {
      required: true,
      number: true,
      maxlength: 10,
      minlength: 10,
    },

    country: {
      required: true,
    },
    state: {
      required: true,
    },
  },
});

$("#modaladdaddress").validate({
  rules: {
    name: {
      required: true,
    },
    housename: {
      required: true,
    },
    street: {
      required: true,
    },
    district: {
      required: true,
    },
    state: {
      required: true,
    },
    pincode: {
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    mobilenumber: {
      required: true,
      minlength: 10,
      maxlength: 10,
    },
  },
});

$("#editdefaddress").validate({
  rules: {
    name: {
      required: true,
    },
    housename: {
      required: true,
    },
    street: {
      required: true,
    },
    district: {
      required: true,
    },
    state: {
      required: true,
    },
    pincode: {
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    mobilenumber: {
      required: true,
      minlength: 10,
      maxlength: 10,
    },
  },
});

$("#editothaddress").validate({
  rules: {
    name: {
      required: true,
    },
    housename: {
      required: true,
    },
    street: {
      required: true,
    },
    district: {
      required: true,
    },
    state: {
      required: true,
    },
    pincode: {
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    mobilenumber: {
      required: true,
      minlength: 10,
      maxlength: 10,
    },
  },
});

$("#profleedit").validate({
  rules: {
    fullname: {
      required: true,
    },
    email: {
      required: true,
      email: true,
    },
    mobilenumber: {
      required: true,
      number: true,
      minlength: 10,
      maxlength: 10,
    },
    country: {
      required: true,
    },
    state: {
      required: true,
    },
  },
});

$("#profilsub").validate({
  rules: {
    fullname: {
      required: true,
    },
    email: {
      required: true,
      email: true,
    },
    mobilenumber: {
      required: true,
      number: true,
      minlength: 10,
      maxlength: 10,
    },
    country: {
      required: true,
    },
    state: {
      required: true,
    },
    location: {
      required: true,
    },
  },
});

//add to cart

function outofstock() {
  document.getElementById("outofstock").classList.remove("selectsize");
  sizeOfProduct = "";
}

// function checking(){
//     alert("kooi")

// }

// var sizeOfProduct;
// function checksize(size){

//     document.getElementById('selectsize').classList.add('selectsize');
//     document.getElementById('outofstock').classList.add('selectsize');
//      sizeOfProduct = size;

// }

// function addtocartproduct(productid,productprice){
//  let cartcounts =  document.getElementById('cartcountvalue').innerHTML;

//  console.log(cartcounts);
//     document.getElementById('selectsize').classList.add('selectsize');
// if(sizeOfProduct){

//     $.ajax({

//         url:'/addtocartproduct?productid='+productid+'&size='+sizeOfProduct+'&subtotal='+productprice,
//         method:'get',
//          success:(response)=>{

//              if(response.sessionrequired){
//                  window.location.replace("/userlogin");
//             }
//              else if(response.added){
//                  cartcounts = Number(cartcounts);
//                 document.getElementById('cartcountvalue').innerHTML = cartcounts+1;
//                 //  document.getElementById("addedcart").classList.remove("selectsize")
//                 // setTimeout(function(){
//                 //      document.getElementById("addedcart").classList.add("selectsize")
//                 //  }, 1000);

//                 toastMixin.fire({
//                     animation: true,
//                     title: 'Signed in Successfully'
//                   });

//                 //    Toast.fire({
//                 //      icon: 'success',
//                 //      title: 'Item added to cart'
//                 //    })

//              }
//              else if(response.exist){
//                 document.getElementById("existincart").classList.remove("selectsize")
//                 setTimeout(function(){
//                      document.getElementById("existincart").classList.add("selectsize")
//                  }, 3000);
//              }

//          }
//     })

// }else{
//     document.getElementById('selectsize').classList.remove('selectsize');
// }

// }

//change cart quantity

function changeQuantity(cartId, proId, size, count, userId, price) {
  let subtotal = document.getElementById(proId + size + "subtotal").innerHTML;
  subtotal = Number(subtotal);

  let currentquantity = document.getElementById(proId + size).innerHTML;

  if (count == -1 && currentquantity == 1) {
    document.getElementById(proId + size + "-").classList.add("hidebut");
  } else if (count == 1 && currentquantity == 10) {
    document.getElementById(proId + size + "+").classList.add("hidebut");
  } else {
    document.getElementById(proId + size + "-").classList.remove("hidebut");
    document.getElementById(proId + size + "+").classList.remove("hidebut");
    $.ajax({
      url: "/change-product-quantity",
      data: {
        cart: cartId,
        product: proId,
        size: size,
        count: count,
        userId: userId,
        price: price,
      },
      method: "post",
      success: (response) => {
        if (response.updated) {
          currentquantity = Number(currentquantity);

          document.getElementById(proId + size).innerHTML =
            currentquantity + count;
          document.getElementById("total").innerHTML = response.total;
          if (count == 1) {
            document.getElementById(proId + size + "subtotal").innerHTML =
              subtotal + price;
          } else {
            document.getElementById(proId + size + "subtotal").innerHTML =
              subtotal - price;
          }
        }
      },
    });
  }
}

function deletecartproduct(proId, cartId, size, productname) {
  let subtotal = document.getElementById(proId + size + "subtotal").innerHTML;
  subtotal = Number(subtotal);
  let total = document.getElementById("total").innerHTML;
  total = Number(total);

  swal("Are you sure do you want to remove " + productname + " from cart ?", {
    buttons: true,
  }).then((willdelete) => {
    if (willdelete) {
      document
        .getElementById(proId + size + "remove")
        .classList.add("selectsize");

      $.ajax({
        url: "/deletecartproduct",
        data: {
          proId: proId,
          cartId: cartId,
          size: size,
        },
        method: "post",
        success: (response) => {
          document.getElementById("total").innerHTML = total - subtotal;

          location.reload();
        },
      });
    } else {
    }
  });
}

// addresscheckbox

$(":checkbox").click(function (e) {
  $(":checkbox").prop("checked", false);
  $(e.target).prop("checked", true);
});

//edit default address
function editdefaultaddress(defaultaddressid) {
  $.ajax({
    url: "/editdefaultaddress?id=" + defaultaddressid,
    method: "get",
    success: (response) => {
      document.getElementById("name").value = response.name;
      document.getElementById("housename").value = response.housename;
      document.getElementById("street").value = response.street;
      document.getElementById("district").value = response.district;
      document.getElementById("state").value = response.state;
      document.getElementById("pincode").value = response.pincode;
      document.getElementById("mobilenumber").value = response.mobilenumber;
      document.getElementById("_id").value = response._id;
    },
  });
}

function profileeditdefaultaddress(defaultaddressid) {
  $.ajax({
    url: "/profileeditdefaultaddress?id=" + defaultaddressid,
    method: "get",
    success: (response) => {
      document.getElementById("name").value = response.name;
      document.getElementById("housename").value = response.housename;
      document.getElementById("street").value = response.street;
      document.getElementById("district").value = response.district;
      document.getElementById("state").value = response.state;
      document.getElementById("pincode").value = response.pincode;
      document.getElementById("mobilenumber").value = response.mobilenumber;
      document.getElementById("_id").value = response._id;
    },
  });
}

//edit other address

function editotheraddress(otheraddressid) {
  $.ajax({
    url: "/editotheraddress?id=" + otheraddressid,
    method: "get",
    success: (response) => {
      document.getElementById("nameedit").value = response.name;
      document.getElementById("housenameedit").value = response.housename;
      document.getElementById("streetedit").value = response.street;
      document.getElementById("districtedit").value = response.district;
      document.getElementById("stateedit").value = response.state;
      document.getElementById("pincodeedit").value = response.pincode;
      document.getElementById("mobilenumberedit").value = response.mobilenumber;
      document.getElementById("_idedit").value = response._id;
    },
  });
}

let placeOrderAddressId;
let paymentMethodForOrder;

function checkoutAddress(addressid) {
  placeOrderAddressId = addressid;
}

function paymentMethod(method) {
  paymentMethodForOrder = method;
}

function placeOrder(userId) {
  let couponcheck = document.getElementById("coupendiscount").textContent;
  let couponcode = document.getElementById("coupencodechecking").innerHTML;
  if (
    typeof placeOrderAddressId === "undefined" ||
    typeof paymentMethodForOrder === "undefined"
  ) {
    // document.getElementById("placeordervalidation").classList.remove("selectsize")
    // setTimeout(function(){
    //      document.getElementById("placeordervalidation").classList.add("selectsize")
    //  }, 5000);
    swal("You should select address and payment method!");
  } else {
    $.ajax({
      url:
        "/place-order?deliveryaddress=" +
        placeOrderAddressId +
        "&paymentmethod=" +
        paymentMethodForOrder +
        "&userId=" +
        userId +
        "&coupencheck=" +
        couponcheck +
        "&couponcode=" +
        couponcode,
      method: "get",
      success: (response) => {
        if (response.codsuccess) {
          location.replace("/ordersuccess");
        } else if (response.data) {
          location.href = response.url;
        } else {
          razorpayPayment(response);
        }
      },
    });
  }
}

function razorpayPayment(order) {
  var options = {
    key: "rzp_test_Ft0y0XvToSOOXp", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Sports hub",
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      verifyPayment(response, order);
    },
    prefill: {
      name: "Ashique Ali",
      email: "ashiquealikmvkd@gmail.com",
      contact: "9999999999",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    // alert(response.error.code);
    // alert(response.error.description);
    // alert(response.error.source);
    // alert(response.error.step);
    // alert(response.error.reason);
    // alert(response.error.metadata.order_id);
    // alert(response.error.metadata.payment_id);
  });
  rzp1.open();
}

function verifyPayment(payment, order) {
  $.ajax({
    url: "/verify-payment",
    data: {
      payment,
      order,
    },
    method: "post",
    success: (response) => {
      if (response.status) {
        location.replace("/ordersuccess");
      } else {
        swal({
          title: "Order failed try again",
        });
      }
    },
  });
}

//buynowwww

function buynowplaceOrder(userId) {
  let couponcheck = document.getElementById("coupendiscount").textContent;
  let couponcode = document.getElementById("coupencodechecking").innerHTML;
  if (
    typeof placeOrderAddressId === "undefined" ||
    typeof paymentMethodForOrder === "undefined"
  ) {
    // document.getElementById("placeordervalidation").classList.remove("selectsize")
    // setTimeout(function(){
    //      document.getElementById("placeordervalidation").classList.add("selectsize")
    //  }, 5000);
    swal("You should select address and payment method!");
  } else {
    $.ajax({
      url:
        "/buynowplace-order?deliveryaddress=" +
        placeOrderAddressId +
        "&paymentmethod=" +
        paymentMethodForOrder +
        "&userId=" +
        userId +
        "&coupencheck=" +
        couponcheck +
        "&couponcode=" +
        couponcode,
      method: "get",
      success: (response) => {
        if (response.codsuccess) {
          location.replace("/ordersuccess");
        } else if (response.data) {
          location.href = response.url;
        } else {
          buynowrazorpayPayment(response);
        }
      },
    });
  }
}

function buynowrazorpayPayment(order) {
  var options = {
    key: "rzp_test_Ft0y0XvToSOOXp", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Sports hub",
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      buynowverifyPayment(response, order);
    },
    prefill: {
      name: "Ashique Ali",
      email: "ashiquealikmvkd@gmail.com",
      contact: "9999999999",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    // alert(response.error.code);
    // alert(response.error.description);
    // alert(response.error.source);
    // alert(response.error.step);
    // alert(response.error.reason);
    // alert(response.error.metadata.order_id);
    // alert(response.error.metadata.payment_id);
  });
  rzp1.open();
}

function buynowverifyPayment(payment, order) {
  $.ajax({
    url: "/buynowverify-payment",
    data: {
      payment,
      order,
    },
    method: "post",
    success: (response) => {
      if (response.status) {
        location.replace("/ordersuccess");
      } else {
        swal({
          title: "Order failed try again",
        });
      }
    },
  });
}

//delete other address
function deleteotheraddress(addressId) {
  swal("Are you sure you do want to remove this address ?", {
    buttons: true,
  }).then((willdelete) => {
    if (willdelete) {
      document.getElementById(addressId).classList.add("selectsize");

      $.ajax({
        url: "/deleteotheraddress?addressid=" + addressId,
        method: "get",
        success: (response) => {},
      });
    } else {
    }
  });
}

// profile submission
// function profileSubmission(){
//     document.getElementById('profilsub').submit();

// }

function cancelproduct(orderId, proId, size) {
  // document.getElementById(proId+size+"uo").innerHTML = "Canceled";

  swal("Are you sure do you want to cancel this product ?", {
    buttons: true,
  }).then((willdelete) => {
    if (willdelete) {
      $.ajax({
        url:
          "/usercancelorder?orderId=" +
          orderId +
          "&proId=" +
          proId +
          "&size=" +
          size,
        method: "get",
        success: (response) => {
          if (response.exist) {
            location.reload();
          }
        },
      });
    } else {
    }
  });
}

if (document.getElementById("paypalcancel")) {
  swal("Payment is cancelled you can try again!");
}

//  function addToWishList(productId){

//     $.ajax({
//         url:'/addtowishlist',
//         data:{
//             productId,

//         },
//         method:'post',
//         success:(response)=>{
//     if(response.sessionrequired){
//         location.href = '/userlogin'
//     }
//     else if(response.exist){

//     }

//         }
//     })

//      }

// function removeFromWishlist(proId){
// document.getElementById(proId).classList.add('selectsize')
// $.ajax({
//     url:'/removefromwishlistpage?productId='+proId,
//     method:'get',
//     success:(response)=>{
// if(response.status){

// }
//     }
// })

// }

function removeFromWishlist(proId, productname) {
  swal("Are you sure do you want to remove " + productname + " from wislist?", {
    buttons: true,
  }).then((willdelete) => {
    if (willdelete) {
      $.ajax({
        url: "/removefromwishlistpage?productId=" + proId,
        method: "get",
        success: (response) => {
          if (response.status) {
            document.getElementById(proId).classList.add("selectsize");
            location.reload();
          }
        },
      });
    }
  });
}

function applycoupen(check) {
  let which;
  if (check === "1") {
    which = 1;
  } else {
    which = 0;
  }
  let coupencode = document.getElementById("coupencode").value;

  $.ajax({
    url: "/applycoupen",
    data: {
      coupencode: coupencode,
      which: which,
    },
    method: "post",
    success: (response) => {
      if (response.notexist) {
        document.getElementById("errormessage").innerHTML =
          "Invalid coupen code";
      } else if (response.alreadyused) {
        document.getElementById("errormessage").innerHTML =
          "This coupen is already used";
      } else if (response.exist) {
        document.getElementById("coupendiscount").textContent =
          "-" + response.savedprice;
        document.getElementById("totalcheckoutprice").textContent =
          response.coupenOfferPrice;
        document.getElementById("closemodal").click();
        document.getElementById("coupencodechecking").innerHTML = coupencode;
      }
    },
  });
}

function allAvailableCoupens() {
  $.ajax({
    url: "/allAvailableCoupens",
    method: "get",
    success: (response) => {
      if (response.data.length > 0) {
        for (var i = 0; i < response.data.length; i++) {
          document.getElementById(i).classList.remove("selectsize");
          document.getElementById(i).innerHTML = response.data[i].coupencode;
        }
      }
    },
  });
}

$(document).on("change", ".uploadProfileInput", function () {
  var triggerInput = this;
  var currentImg = $(this).closest(".pic-holder").find(".pic").attr("src");
  var holder = $(this).closest(".pic-holder");
  var wrapper = $(this).closest(".profile-pic-wrapper");
  $(wrapper).find('[role="alert"]').remove();
  var files = !!this.files ? this.files : [];
  if (!files.length || !window.FileReader) {
    return;
  }
  if (/^image/.test(files[0].type)) {
    // only image file
    var reader = new FileReader(); // instance of the FileReader
    reader.readAsDataURL(files[0]); // read the local file

    reader.onloadend = function () {
      $(holder).addClass("uploadInProgress");
      $(holder).find(".pic").attr("src", this.result);
      $(holder).append(
        '<div class="upload-loader"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>'
      );

      // Dummy timeout; call API or AJAX below

      document.getElementById("profileupload").submit();

      setTimeout(() => {
        $(holder).removeClass("uploadInProgress");
        $(holder).find(".upload-loader").remove();
        // If upload successful
        if (Math.random() < 0.9) {
          $(wrapper).append(
            '<div class="snackbar show" role="alert"><i class="fa fa-check-circle text-success"></i> Profile image updated successfully</div>'
          );

          // Clear input after upload
          $(triggerInput).val("");

          setTimeout(() => {
            $(wrapper).find('[role="alert"]').remove();
          }, 3000);
        } else {
          $(holder).find(".pic").attr("src", currentImg);
          $(wrapper).append(
            '<div class="snackbar show" role="alert"><i class="fa fa-times-circle text-danger"></i> There is an error while uploading! Please try again later.</div>'
          );

          // Clear input after upload
          $(triggerInput).val("");
          setTimeout(() => {
            $(wrapper).find('[role="alert"]').remove();
          }, 3000);
        }
      }, 1500);
    };
  } else {
    $(wrapper).append(
      '<div class="alert alert-danger d-inline-block p-2 small" role="alert">Please choose the valid image.</div>'
    );
    setTimeout(() => {
      $(wrapper).find('role="alert"').remove();
    }, 3000);
  }
});

function sendData(e) {
  const searchResults = document.getElementById("searchResults");
  let match = e.value.match(/^[a-zA-Z]*/);
  let match2 = e.value.match(/\s*/);
  if (match2[0] === e.value) {
    searchResults.innerHTML = "";
    return;
  }
  if (match[0] === e.value) {
    fetch("getSearchProducts", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: e.value }),
    })
      .then((res) => res.json())
      .then((data) => {
        let payload = data.payload;
        searchResults.innerHTML = "";
        if (payload.length < 1) {
          searchResults.innerHTML =
            '<p style="background-color:#ffff;color:rgb(89, 87, 87);padding:2%;margin:0">Sorry. Nothing Found</p>';
          return;
        }
        payload.forEach((item, index) => {
          if (index > 0)
            searchResults.innerHTML += '<hr style="margin:0;padding:0">';
          searchResults.innerHTML += `<a href="shopcategorySearchProducts?_id=${item._id}"><p style="background-color:#ffff;color:rgb(89, 87, 87);padding:2%;margin:0">${item.productname}</p></a>`;
        });
      });

    return;
  }
}

function subcategoryFilter(subcategory, category) {
  $.ajax({
    url:
      "/filterSubCategory?subcategory=" +
      subcategory +
      "&categoryname=" +
      category,
    method: "get",
    success: (response) => {
      if (response.data.length > 0) {
        location.href = "/shopcategory";
      }
    },
  });
}

function brandFilter(barandName, category) {
  $.ajax({
    url: "/filterBrand?brand=" + barandName + "&categoryname=" + category,
    method: "get",
    success: (response) => {
      if (response.data.length > 0) {
        location.href = "/shopcategory";
      }
    },
  });
}
