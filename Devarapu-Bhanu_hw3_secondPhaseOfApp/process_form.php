<?php
// Connect to your database
$servername = "localhost";
$username = "root";<?php
// Database configuration
$servername = "localhost";  
$username = "root";         
$password = "";            
$dbname = "user_data";      

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form data submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $full_name = $_POST["Full-Name"];
    $email = $_POST["My-EmailAddress"];
    $currentlocation = $_POST["Current-location"];
    $searchonline = $_POST["Search-online"];
    $desiredlocation = $_POST["Desired-location"];
    $familybackground = $_POST["family-background"];
    $hobbies = $_POST["My-Hobbies"];
    $currentresidence = $_POST["current-residence"];
    $desiredresidence = $_POST["desired-residence"];
    $significantother = $_POST["significant-other"];
    $factsaboutme = $_POST["Facts-AboutMe"];
    $cvupload = $_POST["cv-upload"];
    $pictureupload = $_POST["picture-upload"];

    // Insert data into the database
    $sql = "INSERT INTO user_info (Full_Name,	MyEmail_Address,	Currentlocation,	IAm_From,	Desired_location,	Familybackground,	MyHobbies,	Current_residence,	desiredresidence,	significantother,	FactsAboutMe, cv_upload, picture_upload)
            VALUES ('$full_name', '$email', '$currentlocation', '$searchonline', '$desiredlocation', '$familybackground', '$hobbies', '$currentresidence', '$desiredresidence', '$significantother', '$factsaboutme','$cvupload','pictureupload')";

    if ($conn->query($sql) === TRUE) {
        echo "Form data has been successfully submitted and saved to the database.";
    } else {
        
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close the database connection
$conn->close();
?>

$password = "";
$dbname = "user_data";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form data submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userInfo = array(
        "FullName" => $_POST["Full-Name"],
        "MyEmailAddress" => $_POST["My-EmailAddress"],
        "Currentlocation" => $_POST["Current-location"],
        "Searchonline" => $_POST["Search-online"],
        "Desiredlocation" => $_POST["Desired-location"],
        "familybackground" => $_POST["family-background"],
        "MyHobbies" => $_POST["My-Hobbies"],
        "MyPlaceofBirth" => $_POST["My-Place-of-Birth"],
        "currentresidence" => $_POST["current-residence"],
        "desiredresidence"=> $_POST["desired-residence"],
        "significantother"=> $_POST["significant-other"]
        "FactsAboutMe"=> $_POST["Facts-AboutMe"]
        "cvupload"=> $_POST["cv-upload"]
        "pictureupload"=> $_POST["picture-upload"]


    );

    // Insert data into the database
    $sql = "INSERT INTO user_info (currentLocation, searchOnline, desiredLocation, familyBackground, placeOfBirth, currentResidence, desiredResidence, significantOther, otherInfo, cvFileName, pictureFileName)
            VALUES (
                '{$userInfo['currentLocation']}',
                '{$userInfo['searchOnline']}',
                '{$userInfo['desiredLocation']}',
                '{$userInfo['familyBackground']}',
                '{$userInfo['placeOfBirth']}',
                '{$userInfo['currentResidence']}',
                '{$userInfo['desiredResidence']}',
                '{$userInfo['significantOther']}',
                '{$userInfo['otherInfo']}',
                '{$userInfo['cvFileName']}',
                '{$userInfo['pictureFileName']}'

            )";

    if ($conn->query($sql) === TRUE) {
        echo "Form data has been successfully submitted and saved to the database.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close the database connection
$conn->close();
?>
