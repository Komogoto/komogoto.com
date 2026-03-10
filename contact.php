<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation basique
if (!$name || !$email || !$subject || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

// Sanitisation
$name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$to      = 'hello@komogoto.com';
$subject_map = [
    'membre'      => 'Devenir membre',
    'hebergement' => 'Hébergement web',
    'mirror'      => 'Serveurs miroirs',
    'bug'         => 'Signaler un problème',
    'autre'       => 'Autre',
];
$subject_label = $subject_map[$subject] ?? $subject;

$mail_subject = '[Komogoto] ' . $subject_label . ' – ' . $name;
$mail_body    = "Nouveau message depuis le formulaire de contact.\n\n"
              . "Nom    : $name\n"
              . "Email  : $email\n"
              . "Sujet  : $subject_label\n\n"
              . "Message :\n$message\n";

$headers  = "From: hello@komogoto.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $mail_subject, $mail_body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi. Veuillez réessayer.']);
}
