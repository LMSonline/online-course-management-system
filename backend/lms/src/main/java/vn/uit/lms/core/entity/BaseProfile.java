package vn.uit.lms.core.entity;

import vn.uit.lms.shared.constant.Gender;

import java.time.LocalDate;

public interface BaseProfile {
    String getFullName();
    Gender getGender();
    String getBio();
    LocalDate getBirthDate();
}

