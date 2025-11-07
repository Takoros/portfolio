<?php

namespace App\Controller;

use App\Form\ContactFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;

final class MainController extends AbstractController
{
    const SUPPORTED_LANGUAGES = ['fr', 'en'];
    const SUPPORTED_LANGUAGES_REQUIREMENTS = 'fr|en';

    /**
     * Redirects the user to the correct language
     */
    #[Route('/', name: 'app_index')]
    public function index(Request $request): Response
    {
        return $this->redirectToRoute('app_home', ['_locale' => $request->getPreferredLanguage(self::SUPPORTED_LANGUAGES)]);
    }

    #[Route('/{_locale}/home', name: 'app_home', requirements: ['_locale' => self::SUPPORTED_LANGUAGES_REQUIREMENTS])]
    public function home($_locale): Response
    {
        return $this->render('home.html.twig', [
            '_locale' => $_locale
        ]);
    }

    #[Route('/{_locale}/downloadCV', name: 'app_downloadCV', requirements: ['_locale' => self::SUPPORTED_LANGUAGES_REQUIREMENTS])]
    public function downloadCV($_locale): Response
    {
        return $this->file('files/CV_Steven_Breziat_' . strtoupper($_locale) . '.pdf');
    }

    #[Route('/{_locale}/projects', name: 'app_projects', requirements: ['_locale' => self::SUPPORTED_LANGUAGES_REQUIREMENTS])]
    public function projects($_locale): Response
    {
        return $this->render('projects.html.twig', [
            '_locale' => $_locale
        ]);
    }

    #[Route('/{_locale}/contact', name: 'app_contact', requirements: ['_locale' => self::SUPPORTED_LANGUAGES_REQUIREMENTS])]
    public function contact(Request $request, MailerInterface $mailer, $_locale): Response
    {
        $contactForm = $this->createForm(ContactFormType::class);
        $contactForm->handleRequest($request);

        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            $data = $contactForm->getData();

            $name = $data['name'] ?? 'n/a';
            $email = $data['email'] ?? 'noreply@example.com';
            $subject = $data['subject'] ?? 'Contact form';
            $message = $data['message'] ?? '';

            $emailMessage = (new Email())
                ->from($email)
                ->to('steven.breziat@gmail.com')
                ->subject(sprintf('[Portfolio] %s', $subject))
                ->text(<<<'TXT'
                        Name: %s
                        Email: %s

                        Message:
                        %s
                        TXT
                )
                ->html(sprintf('<p><strong>Name:</strong> %s</p><p><strong>Email:</strong> %s</p><hr/><p>%s</p>', htmlspecialchars($name, ENT_QUOTES, 'UTF-8'), htmlspecialchars($email, ENT_QUOTES, 'UTF-8'), nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'))));

            $mailer->send($emailMessage);

            $this->addFlash('success', 'Votre message a bien été envoyé.');

            return $this->redirectToRoute('app_contact', ['_locale' => $_locale]);
        }

        return $this->render('contact.html.twig', [
            '_locale' => $_locale,
            'contactForm' => $contactForm
        ]);
    }
}
