#!/usr/bin/env php
<?php
function jsloader_parse_info_file($filename) {
  $info = array();
  if (!is_readable($filename)) {
    return $info;
  }
  $handle = fopen($filename, 'r');
  while ($line = fgets($handle)) {
    
    // Skip blanks
    $line = trim($line);
    if (strlen($line) == 0) {
      continue;
    }
    
    // Skip comments
    if ($line{0} == ';') {
      print "Skipping comment\n";
      continue;
    }
    
    $pos = strpos($line, '=');
    // Skip false and lines starting with =.
    if ($pos === FALSE || $pos === 0) {
      continue;
    }
    
    // Split by pos (faster than split()).
    $key = substr($line, 0, $pos);
    $val = trim(substr($line, $pos + 1));
    
    print "Key: $key; Val: $val";
    
    // Do value parsing:
    $first_char = substr($val,0,1); // Faster than {} syntax.
    if($first_char == '"' || $first_char == '\'') {
      $val = substr($val, 1);
    
      // Check to make sure line ends with quote.
      // If not, we keep consuming lines.
      $val_len = strlen($val);
      $val_last = substr($val, $val_len - 1);
      if ($val_last != $first_char ||
        ($val_last == $first_char && substr($val, $val_len - 2, $val_len -1) == '\\')
      ) {
        print "Looking for closing quote\n";
        // Consume lines until we hit closing quote.
        $closed = FALSE;
        while (!$closed) {
          $another_line = fgets($handle);
          if ($another_line = NULL) {
            // We hit the end of the file:
            fclose($handle);
            return $info;
          }
          $check_line = rtrim($another_line);
          $check_line_len = count($check_line);
          if (substr($check_line, $check_line_len -2, $check_line_len -1) == $first_char) {
            $another_line = substr($check_line, $check_line_len - 2);
            $closed = TRUE;
          }
          $val .=  $another_line;
        }
      }
      else {
        print "\nXXX\n";
        $val = substr($val, 0, $val_last - 1);
      }
    }
    
    // Do key parsing:
    $key_bracket = strpos($key, '[');
    if ($key_bracket !== FALSE) {
      if ($key_bracket === 0) {
        // Malformed line. Skip it.
        print "Skipped malformed line\n";
        continue;
      }
      $real_key = substr($key, 0, $key_bracket);
      if (!array_key_exists($real_key, $info)) {
        $info[$real_key] = array();
      }
      $tokens = split(']', substr($key, $key_bracket), 255);
      foreach ($tokens as $token) {
        $token = trim($token);
        if (empty($token)) {
          //skip?
        }
        elseif ($token == '[') {
          // No key
          $info[$real_key][] = $val;
          //$current_array[] = $val;
          //$current_array = $current_array[count($current_array) -1];
        } 
        else {
          // Get the key
          /*if (strpos($token, '[') !== FALSE) {
            print "Skipped malformed token\n";
            continue; // malformed
          }*/
          $array_key = substr($token, 1); // Drop [
          $info[$real_key][$array_key] = $val;
          //$current_array[$array_key] = $val;
          //$current_array = $current_array[$array_key];
        }
      }
    }
    else {
      $info[$key] = $val;
    }
  }
  return $info;
}

print_r(jsloader_parse_info_file('./jsloader.info'));
?>