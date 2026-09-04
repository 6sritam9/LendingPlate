package com.trustlend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Turns on Spring's @Scheduled support so OverdueCheckScheduler actually runs. */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
