using System.Net;
using System.Net.Mail;
using JailTracker.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace JailTracker.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public void SendEmail(string recipient, string subject, string body)
    {
#if RELEASE
        using var mailMessage = new MailMessage(_configuration["EmailSettings:Login"], recipient);
        mailMessage.Subject = subject;
        mailMessage.Body = body;
        mailMessage.IsBodyHtml = true;

        mailMessage.From = new MailAddress(_configuration["EmailSettings:Login"], _configuration["EmailSettings:DisplayName"]);

        int port = int.Parse(_configuration["EmailSettings:StmpPort"]);

        using var client = new SmtpClient(_configuration["EmailSettings:StmpHost"], port);
        client.EnableSsl = true;
        client.UseDefaultCredentials = false;
        client.Credentials = new NetworkCredential(_configuration["EmailSettings:Login"], _configuration["EmailSettings:Password"]);

        client.Send(mailMessage);
        client.Dispose();
#endif
    }
}