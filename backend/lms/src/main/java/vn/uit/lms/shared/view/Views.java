package vn.uit.lms.shared.view;

/**
 * Defines JSON serialization views for role-based field visibility.
 */
public class Views {
    public interface Public {}
    public interface Student extends Public {}
    public interface Teacher extends Public {}
    public interface Admin extends Public {}
}

