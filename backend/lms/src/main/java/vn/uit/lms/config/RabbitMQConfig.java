package vn.uit.lms.config;


import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String VIDEO_CONVERT_QUEUE = "video-convert";
    public static final String VIDEO_CONVERT_ROUTING_KEY = "video.convert";
    public static final String VIDEO_CONVERT_EXCHANGE = "video-convert-exchange";

    @Bean
    public Queue videoConvertQueue() {
        return new Queue(VIDEO_CONVERT_QUEUE, true);
    }

    @Bean
    public DirectExchange videoExchange() {
        return new DirectExchange(VIDEO_CONVERT_EXCHANGE);
    }

    @Bean
    public Binding binding() {
        return BindingBuilder
                .bind(videoConvertQueue())
                .to(videoExchange())
                .with(VIDEO_CONVERT_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory connectionFactory,
            MessageConverter messageConverter
    ) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}
