# Top 100 Recruit Analysis Helper Functions

library(tidyverse)
load("rankings_pos.rda")
load("advanced_all.rda")
load("stats_joined.rda")

# Top 100 Recruit Filter
# Flexible filter for stats_joined
# Pass arguments you want to filter on

filter_subset <- function(
    data,
    class_min = 2016, class_max = 2024,
    conf_vec   = NULL,        # e.g., "Big Ten"
    tier_vec   = NULL,        # e.g., "1-25"
    pos_vec    = NULL,        # e.g., "G" or c("G","W")
    mpg_min    = NULL         # e.g., 10 for 10+ mpg
) {
  out <- data %>%
    filter(
      between(CLASS, class_min, class_max)
    )
  
  if (!is.null(conf_vec)) {
    out <- out %>% filter(conference %in% conf_vec)
  }
  if (!is.null(tier_vec)) {
    out <- out %>% filter(tier %in% tier_vec)
  }
  if (!is.null(pos_vec)) {
    out <- out %>% filter(pos_group %in% pos_vec)
  }
  if (!is.null(mpg_min)) {
    out <- out %>% filter(as.numeric(mp) / as.numeric(games) >= mpg_min)
  }
  
  out
}


# Transfer History Table
# One row per recruit per season they appear in the advanced data

# One row per player-school-season from the advanced stats
player_school_year <- advanced_all %>%
  select(player_clean, school_clean, season_start) %>%  # adjust names if needed
  distinct()

# Join recruits to their full season-by-season school history
history <- rankings_pos %>%
  left_join(player_school_year,
            by = "player_clean") %>%
  group_by(CLASS, RK, NAME, COLLEGE, conference, player_clean) %>%
  arrange(season_start, .by_group = TRUE) %>%
  mutate(
    # School they enrolled at as a freshman
    first_school = first(school_clean),
    # T/F if they've ever played at more than one school
    transferred  = n_distinct(school_clean, na.rm = TRUE) > 1
  ) %>%
  ungroup()


history <- rankings_pos %>%
  left_join(player_school_year,
            by = "player_clean") %>%
  group_by(CLASS, RK, NAME, COLLEGE, conference, player_clean) %>%
  arrange(season_start, .by_group = TRUE) %>%
  mutate(
    first_school = first(school_clean),
    transferred  = n_distinct(school_clean, na.rm = TRUE) > 1
  ) %>%
  ungroup()

# Conference Colors (for plots)
conf_colors <- c(
  "Big Ten" = "#0088CE",
  "ACC"     = "#013CA6",
  "SEC"     = "#FFD24F",
  "Big 12"  = "#C41230",
  "Other"   = "#808080"
)