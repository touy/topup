/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ltc.srv.com;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
/**
 *
 * @author seesavadphimmasen
 */
class ltc {    
    private static SecretKeySpec secretKey;
    private static byte[] key; 
    public static void setKey(String privateKey){
        MessageDigest sha = null;
        try {
            key = privateKey.getBytes("UTF-8");
            sha = MessageDigest.getInstance("SHA-1");
            key = sha.digest(key);
            key = Arrays.copyOf(key, 16); 
            secretKey = new SecretKeySpec(key, "AES");
        } 
        catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } 
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    } 
    public static String encrypt(String dataString, String privateKey){
        try
        {
            setKey(privateKey);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            return Base64.getEncoder().encodeToString(cipher.doFinal(dataString.getBytes("UTF-8")));
        } 
        catch (Exception e) 
        {
            System.out.println("Error while encrypting: " + e.toString());
        }
        return null;
    }
    public static String decrypt(String decryptString, String privatekey){
        try
        {
            setKey(privatekey);
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            return new String(cipher.doFinal(Base64.getDecoder().decode(decryptString)));
        } 
        catch (Exception e) 
        {
            System.out.println("Error while decrypting: " + e.toString());
        }
        return null;
    }
    public static void main(String[] args){
    //System.out.println("(^*^) Welcome to Lao Telecom (^*^)");
    //System.out.println("==> Encrypt and Decrypt data <==");
        
        if(args[0]=="0"){ //encrypt
            ltc.encrypt(args[1],args[2]); //1 for key , 2 for string
        }
        else if(args[0]=="1"){//decrypt
            ltc.decrypt(args[1],args[2]);
        
        }
    }
}


