
function uploadPhoto() {
    var fileInput = document.getElementById('fileInput');
    var uploadedImage = document.getElementById('uploadedImage');
    
    fileInput.addEventListener('change', function() {
        var file = fileInput.files[0];
        
        if (file) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
                uploadedImage.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
            
            alert('Photo uploaded successfully!');
        } else {
            alert('No file selected.');
        }
    });
}